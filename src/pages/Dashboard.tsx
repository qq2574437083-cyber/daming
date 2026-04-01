import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { CheckSquare, Clock, Folder, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, tasks, projects, isLoading, fetchTasks, fetchProjects, checkAuth } = useStore();

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      if (user) {
        await fetchTasks();
        await fetchProjects();
      }
    };
    init();
  }, [user, checkAuth, fetchTasks, fetchProjects]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded mb-3"></div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded mb-3"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <CheckSquare className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to TaskMaster</h1>
          <p className="text-gray-600 mb-8">Sign in to manage your tasks and projects</p>
          <div className="flex flex-col space-y-3">
            <a
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;

  // Calculate project statistics
  const totalProjects = projects.length;

  // Get upcoming tasks (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  // Get high priority tasks
  const highPriorityTasks = tasks
    .filter((task) => task.priority === 'high' && task.status !== 'completed')
    .slice(0, 5);

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Tasks</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalTasks}</h3>
          <p className="text-sm text-gray-500 mt-2">
            {completedTasks} completed
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Pending Tasks</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{pendingTasks}</h3>
          <p className="text-sm text-gray-500 mt-2">
            {inProgressTasks} in progress
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Folder className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Projects</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalProjects}</h3>
          <p className="text-sm text-gray-500 mt-2">
            Active projects
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Completion Rate</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{completionRate}%</h3>
          <p className="text-sm text-gray-500 mt-2">
            Tasks completed
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </a>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center p-3 rounded-md hover:bg-gray-50">
                  <div className={`h-2 w-2 rounded-full mr-3 ${
                    task.priority === 'high'
                      ? 'bg-red-500'
                      : task.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'No due date'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming tasks</p>
            </div>
          )}
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">High Priority Tasks</h2>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </a>
          </div>

          {highPriorityTasks.length > 0 ? (
            <div className="space-y-4">
              {highPriorityTasks.map((task) => (
                <div key={task.id} className="flex items-start p-3 rounded-md hover:bg-gray-50">
                  <div className="h-2 w-2 rounded-full mr-3 mt-2 bg-red-500" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {task.project_id
                        ? projects.find((p) => p.id === task.project_id)?.name
                        : 'No project'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No high priority tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;