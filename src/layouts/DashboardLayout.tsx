import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Atom, LayoutDashboard, BookOpen, Layers, 
  Code2, Beaker, CheckSquare, Settings,
  LogOut, Menu, Bot, HelpCircle
} from 'lucide-react';

export default function DashboardLayout() {
  const { userProfile, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Curriculum', path: '/curriculum', icon: <Layers className="w-5 h-5" /> },
    { name: 'Lessons', path: '/curriculum', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Quantum Lab', path: '/quantum-lab', icon: <Beaker className="w-5 h-5" /> },
    { name: 'Coding', path: '/coding', icon: <Code2 className="w-5 h-5" /> },
    { name: 'Quizzes', path: '/curriculum', icon: <CheckSquare className="w-5 h-5" /> },
    { name: 'Projects', path: '/projects', icon: <Atom className="w-5 h-5" /> },
    { name: 'Interview Questions', path: '/interview-questions', icon: <HelpCircle className="w-5 h-5" /> },
    { name: 'Coding Practice', path: '/practice/quantum-computing', icon: <Code2 className="w-5 h-5" /> },
    { name: 'AI Tutor', path: '/ai-tutor', icon: <Bot className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-6 border-b border-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <Atom className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight quantum-text-gradient">ENTANGLE</span>
            </Link>
          </div>
          
          <div className="p-4 border-b border-border bg-muted/20">
            <div className="text-sm text-muted-foreground mb-1">Active Course</div>
            <div className="font-semibold text-primary mb-3">
              Quantum Computing
            </div>
            <Link 
              to="/select-learning-path" 
              onClick={() => setSidebarOpen(false)}
              className="text-xs font-medium text-foreground bg-secondary/80 hover:bg-secondary px-3 py-1.5 rounded-full inline-block transition-colors"
            >
              Change Path
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'}
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-card/50 backdrop-blur sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-md lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">

            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full border border-border">
              <span className="text-sm font-medium text-blue-400">Lvl</span>
              <span className="text-sm font-bold">{userProfile?.level || 1}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden font-bold text-primary">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
