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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">欢迎使用任务大师</h1>
          <p className="text-gray-600 mb-8">登录后即可管理您的任务和项目</p>
          <div className="flex flex-col space-y-3">
            <a
              href="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              登录
            </a>
            <a
              href="/register"
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
            >
              创建账户
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 计算任务统计
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress').length;

  // 计算项目统计
  const totalProjects = projects.length;

  // 获取即将到期的任务（未来7天）
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

  // 获取高优先级任务
  const highPriorityTasks = tasks
    .filter((task) => task.priority === 'high' && task.status !== 'completed')
    .slice(0, 5);

  // 计算完成率
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 优先级文本
  const priorityText = {
    low: '低',
    medium: '中',
    high: '高'
  };

  // 状态文本
  const statusText = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">仪表盘</h1>
        <p className="text-gray-600">欢迎回来，{user.name}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">总任务数</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalTasks}</h3>
          <p className="text-sm text-gray-500 mt-2">
            已完成 {completedTasks} 项
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">待处理</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{pendingTasks}</h3>
          <p className="text-sm text-gray-500 mt-2">
            进行中 {inProgressTasks} 项
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Folder className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">项目数</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalProjects}</h3>
          <p className="text-sm text-gray-500 mt-2">
            活跃项目
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">完成率</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{completionRate}%</h3>
          <p className="text-sm text-gray-500 mt-2">
            任务已完成
          </p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 即将到期的任务 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">即将到期</h2>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
              查看全部
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
                      截止日期：{task.due_date ? format(new Date(task.due_date), 'yyyy年MM月dd日') : '无截止日期'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {statusText[task.status]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无即将到期的任务</p>
            </div>
          )}
        </div>

        {/* 高优先级任务 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">高优先级</h2>
            <a href="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
              查看全部
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
                        : '无项目'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无高优先级任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;