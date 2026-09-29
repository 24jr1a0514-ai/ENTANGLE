import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { User, Bell, Moon, Sun, Monitor, LogOut, Save, Loader2, Mail, GraduationCap, Edit2, Key, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UserPreferences, LearningPath } from '../types';

export default function SettingsPage() {
  const { user, userProfile, refreshProfile, logout, changePassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: true,
    learningReminders: true,
    quizAlerts: true,
    projectDeadlines: true,
    learningLanguage: 'en',
    difficultyPreference: 'intermediate',
    autoplayVideos: true,
    showHints: 'auto',
    fontSize: 'medium',
    reducedAnimations: false,
    readAloud: false,
    activityVisibility: 'public',
    personalizedRecommendations: true,
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({ oldPassword: '', newPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState<{type: 'error'|'success', message: string} | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    learningPath: 'intermediate' as LearningPath
  });

  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordStatus, setResetPasswordStatus] = useState<{type: 'error'|'success', message: string} | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordEmail.trim()) {
      setResetPasswordStatus({ type: 'error', message: 'Please enter your email address' });
      return;
    }
    try {
      setIsResettingPassword(true);
      setResetPasswordStatus(null);
      await resetPassword(resetPasswordEmail);
      setResetPasswordStatus({ type: 'success', message: 'Password reset email sent! Check your inbox.' });
      setResetPasswordEmail('');
    } catch (error: any) {
      setResetPasswordStatus({ type: 'error', message: error.message || 'Failed to send reset email' });
    } finally {
      setIsResettingPassword(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      if (userProfile.preferences) {
        setPreferences(userProfile.preferences);
      }
      setProfileFormData({
        name: userProfile.name || '',
        learningPath: userProfile.learningPath || 'intermediate'
      });
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      await userService.updateUserProfile(userProfile.uid, {
        preferences
      });
      await refreshProfile();
      // Apply theme immediately
      const root = document.documentElement;
      if (preferences.theme === 'light') {
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await userService.updateUserProfile(userProfile.uid, {
        name: profileFormData.name,
        learningPath: profileFormData.learningPath
      });
      await refreshProfile();
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordFormData.oldPassword || !passwordFormData.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please fill in both fields.' });
      return;
    }
    setIsChangingPassword(true);
    setPasswordStatus(null);
    try {
      await changePassword(passwordFormData.oldPassword, passwordFormData.newPassword);
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordFormData({ oldPassword: '', newPassword: '' });
    } catch (error: any) {
      console.error(error);
      setPasswordStatus({ type: 'error', message: error.message || 'Failed to change password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account profile and application preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Column - Navigation/Tabs */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-4 bg-secondary/50 rounded-xl border border-border flex flex-col gap-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2 uppercase tracking-wider">Account</h3>
            
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-left w-full ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'hover:bg-background/80 text-foreground'}`}
            >
              <User className="w-4 h-4" /> Profile Details
            </button>
            
            <button 
              onClick={() => setActiveTab('preferences')} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-left w-full ${activeTab === 'preferences' ? 'bg-primary/10 text-primary' : 'hover:bg-background/80 text-foreground'}`}
            >
              <Monitor className="w-4 h-4" /> Preferences
            </button>
            
            <div className="h-px bg-border my-2"></div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium text-left w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="md:col-span-3 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Profile Details</h3>
                  {!isEditingProfile ? (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-secondary/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center text-primary text-4xl font-bold overflow-hidden shadow-lg shadow-primary/20 shrink-0">
                    {userProfile.photoURL ? (
                      <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userProfile.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {userProfile.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 border-t border-border pt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    {isEditingProfile ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={profileFormData.name}
                          onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-background/50 rounded-lg border border-border/50">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{userProfile.name || 'No name provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Education Level</label>
                    {isEditingProfile ? (
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          value={profileFormData.learningPath}
                          onChange={(e) => setProfileFormData({ ...profileFormData, learningPath: e.target.value as LearningPath })}
                          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                        >
                          <option value="school">High School / K-12</option>
                          <option value="undergraduate">Undergraduate Student</option>
                          <option value="postgraduate">Postgraduate / Researcher</option>
                          <option value="intermediate">Self-Taught / Enthusiast</option>
                          <option value="others">Other</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-background/50 rounded-lg border border-border/50">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {userProfile.learningPath === 'school' && 'High School'}
                          {userProfile.learningPath === 'undergraduate' && 'Undergraduate'}
                          {userProfile.learningPath === 'postgraduate' && 'Postgraduate'}
                          {userProfile.learningPath === 'intermediate' && 'Self-Taught'}
                          {userProfile.learningPath === 'others' && 'Other'}
                          {!userProfile.learningPath && <span className="text-muted-foreground italic">Not specified</span>}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Change Password Section */}
                  <div className="space-y-5 border-t border-border pt-6 mt-6">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary" />
                      Change Password
                    </h4>
                    
                    {user?.providerData.some(p => p.providerId === 'google.com') ? (
                      <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 text-sm text-muted-foreground flex flex-col gap-2">
                        <p>You are currently signed in with Google.</p>
                        <p>To change your password or security settings, please manage your Google account directly.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        {passwordStatus && (
                          <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            passwordStatus.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {passwordStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {passwordStatus.message}
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                          <input
                            type="password"
                            value={passwordFormData.oldPassword}
                            onChange={(e) => setPasswordFormData({ ...passwordFormData, oldPassword: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">New Password</label>
                          <input
                            type="password"
                            value={passwordFormData.newPassword}
                            onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="Enter new password"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isChangingPassword}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                          Update Password
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Forgot Password Section */}
                  <div className="space-y-5 border-t border-border pt-6 mt-6">
                    <h4 className="text-lg font-semibold flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Forgot / Reset Password
                    </h4>
                    
                    {user?.providerData.some(p => p.providerId === 'google.com') ? (
                      <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 text-sm text-muted-foreground flex flex-col gap-2">
                        <p>You are currently signed in with Google.</p>
                        <p>Password reset is not applicable for Google-authenticated accounts.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        {resetPasswordStatus && (
                          <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                            resetPasswordStatus.type === 'error' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          }`}>
                            {resetPasswordStatus.type === 'success' && <CheckCircle className="w-4 h-4" />}
                            {resetPasswordStatus.message}
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Registered Email Address</label>
                          <input
                            type="email"
                            value={resetPasswordEmail}
                            onChange={(e) => setResetPasswordEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                            placeholder="Enter your email to receive a reset link"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isResettingPassword}
                          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isResettingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                          Send Reset Email
                        </button>
                      </form>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-card rounded-xl border border-border p-6 shadow-sm">
                <div>
                  <h3 className="text-xl font-semibold">Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your app experience.</p>
                </div>
                <button 
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSavingPreferences ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Preferences
                </button>
              </div>

              {/* Appearance */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" /> Appearance
                </h3>
                
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">Select your preferred color scheme.</p>
                  </div>
                  <div className="flex bg-secondary p-1 rounded-lg border border-border">
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        preferences.theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        preferences.theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" /> Notifications
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive weekly summaries and important updates.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={preferences.emailNotifications}
                        onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Get instant alerts for new lessons and quizzes.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={preferences.pushNotifications}
                        onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Additional Notification Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary"
                        checked={preferences.learningReminders}
                        onChange={(e) => setPreferences({ ...preferences, learningReminders: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Learning Reminders</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary"
                        checked={preferences.quizAlerts}
                        onChange={(e) => setPreferences({ ...preferences, quizAlerts: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Quiz Alerts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary focus:ring-primary"
                        checked={preferences.projectDeadlines}
                        onChange={(e) => setPreferences({ ...preferences, projectDeadlines: e.target.checked })}
                      />
                      <span className="text-sm font-medium">Project Deadlines</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" /> Learning Experience
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Difficulty Preference</label>
                    <select
                      value={preferences.difficultyPreference}
                      onChange={(e) => setPreferences({ ...preferences, difficultyPreference: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Hint Display</label>
                    <select
                      value={preferences.showHints}
                      onChange={(e) => setPreferences({ ...preferences, showHints: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                    >
                      <option value="auto">Show automatically after 2 attempts</option>
                      <option value="manual">Only show when requested</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={preferences.autoplayVideos}
                      onChange={(e) => setPreferences({ ...preferences, autoplayVideos: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <div>
                    <p className="font-medium">Autoplay Course Videos</p>
                    <p className="text-xs text-muted-foreground">Automatically start videos when entering a topic.</p>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Accessibility
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Base Font Size</label>
                    <div className="flex gap-2">
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => setPreferences({ ...preferences, fontSize: size as any })}
                          className={`px-4 py-2 rounded-lg border text-sm capitalize transition-colors ${
                            preferences.fontSize === size ? 'bg-primary border-primary text-primary-foreground font-medium shadow-sm' : 'bg-background border-border hover:bg-secondary/50 text-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={preferences.reducedAnimations}
                        onChange={(e) => setPreferences({ ...preferences, reducedAnimations: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <div>
                      <p className="font-medium">Reduce Motion</p>
                      <p className="text-xs text-muted-foreground">Disable non-essential animations across the app.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-primary" /> Privacy
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Profile Visibility</label>
                    <select
                      value={preferences.activityVisibility}
                      onChange={(e) => setPreferences({ ...preferences, activityVisibility: e.target.value as any })}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground appearance-none"
                    >
                      <option value="public">Public (Everyone can see)</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={preferences.personalizedRecommendations}
                      onChange={(e) => setPreferences({ ...preferences, personalizedRecommendations: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <div>
                    <p className="font-medium">Personalized Recommendations</p>
                    <p className="text-xs text-muted-foreground">Allow Entangle to suggest courses based on your learning history.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
