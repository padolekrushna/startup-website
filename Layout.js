import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    BarChart3, ShoppingCart, User as UserIcon, LogIn, LogOut,
    LayoutDashboard, DollarSign, BookOpen, Briefcase, FileText,
    Users, Phone, PlusCircle, Settings, HelpCircle, LifeBuoy, Menu
} from 'lucide-react';
import Chatbot from '@/components/Chatbot';

const mainNavLinks = [
    { name: 'Marketplace', path: 'Marketplace', icon: ShoppingCart },
    { name: 'Courses', path: 'Courses', icon: BookOpen },
    { name: 'Services', path: 'Services', icon: LifeBuoy },
    { name: 'Blog', path: 'Blog', icon: FileText },
    { name: 'Careers', path: 'Careers', icon: Briefcase },
    { name: 'About', path: 'About', icon: Users },
    { name: 'Contact', path: 'Contact', icon: Phone },
];

const userNavLinks = [
    { name: 'My Purchases', path: 'MyPurchases', icon: DollarSign },
    { name: 'My Dashboards', path: 'MyDashboards', icon: LayoutDashboard },
    { name: 'Upload Dashboard', path: 'UploadDashboard', icon: PlusCircle },
];

const creatorNavLinks = [
    { name: 'Create Course', path: 'UploadCourse', icon: BookOpen },
    { name: 'Write Blog', path: 'UploadBlog', icon: FileText },
];

export default function Layout({ children, currentPageName }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const location = useLocation();

    const isAdmin = user && user.email === 'krushnapadole18@gmail.com';

    React.useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const userData = await User.me();
                setUser(userData);
            } catch (e) {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUser();
    }, [location.key]);

    const handleAuthAction = async () => {
        if (user) {
            await User.logout();
            setUser(null);
            window.location.href = createPageUrl('Marketplace');
        } else {
            User.loginWithRedirect(window.location.href);
        }
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const path = createPageUrl(to);
        const isActive = location.pathname === path;
        return (
            <Link to={path}>
                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="truncate">{children}</span>
                </Button>
            </Link>
        );
    };

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="h-20 flex items-center px-6 border-b border-slate-200">
                <Link to={createPageUrl('Marketplace')} className="flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-indigo-600" />
                    <span className="text-xl font-bold text-slate-900">Power BI<span className="text-indigo-600">Junction</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                <div>
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Explore</p>
                    {mainNavLinks.map(link => (
                        <NavLink key={link.path} to={link.path} icon={link.icon}>{link.name}</NavLink>
                    ))}
                </div>

                {user && (
                    <>
                        <div>
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">My Content</p>
                            {userNavLinks.map(link => (
                                <NavLink key={link.path} to={link.path} icon={link.icon}>{link.name}</NavLink>
                            ))}
                        </div>
                        
                        <div>
                            <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Create & Share</p>
                            {creatorNavLinks.map(link => (
                                <NavLink key={link.path} to={link.path} icon={link.icon}>{link.name}</NavLink>
                            ))}
                        </div>
                    </>
                )}

                <div>
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase mb-2">Help</p>
                    <NavLink to="UserGuide" icon={HelpCircle}>User Guide</NavLink>
                </div>
            </nav>

            {/* User Profile / Auth */}
            <div className="p-4 border-t border-slate-200">
                {loading ? <div className="h-10 w-full bg-slate-200 animate-pulse rounded-md" /> : (
                    user ? (
                        <div className="flex items-center justify-between">
                            <Link to={createPageUrl('Profile')} className="flex items-center gap-3 group">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={user.avatar_url} />
                                    <AvatarFallback className="bg-slate-200">{user.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="truncate">
                                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600">{user.full_name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleAuthAction}>
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleAuthAction} className="w-full gap-2">
                            <LogIn className="w-4 h-4"/>
                            Sign In / Register
                        </Button>
                    )
                )}
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
            
            <div className="flex h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-64 flex-shrink-0 bg-white border-r border-slate-200 flex-col">
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Mobile Header */}
                    <header className="lg:hidden h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-4">
                        <Link to={createPageUrl('Marketplace')} className="flex items-center gap-2">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                            <span className="text-lg font-bold text-slate-900">Power BI<span className="text-indigo-600">Junction</span></span>
                        </Link>
                        
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="flex flex-col h-full">
                                    <SidebarContent />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </header>

                    {/* Desktop Header */}
                    <header className="hidden lg:flex h-20 flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-slate-200 items-center justify-between px-8">
                        <h1 className="text-2xl font-bold text-slate-800">{currentPageName}</h1>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            
            <Chatbot />
        </div>
    );
}
