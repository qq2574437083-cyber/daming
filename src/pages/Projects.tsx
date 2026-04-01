import { useState, useEffect } from 'react';
import { useStore, Project } from '../lib/store';
import { Folder, Plus, Trash2, Edit, CheckSquare, Users } from 'lucide-react';

const Projects = () => {
  const { user, projects, tasks, isLoading, fetchProjects, fetchTasks, addProject, updateProject, deleteProject, checkAuth } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      if (user) {
        await fetchProjects();
        await fetchTasks();
      }
    };
    init();
  }, [user, checkAuth, fetchProjects, fetchTasks]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-10 w-10 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <Folder className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">欢迎使用任务大师</h1>
          <p className="text-gray-600 mb-8">登录后即可管理您的项目</p>
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

  // 添加项目
  const handleAddProject = async () => {
    if (!newProject.name) return;
    
    await addProject({
      ...newProject,
      user_id: user.id,
    });
    
    setNewProject({
      name: '',
      description: '',
    });
    setShowAddModal(false);
  };

  // 编辑项目
  const handleEditProject = async () => {
    if (!editingProject) return;
    
    await updateProject(editingProject.id, editingProject);
    setEditingProject(null);
    setShowEditModal(false);
  };

  // 删除项目
  const handleDeleteProject = async (id: string) => {
    if (window.confirm('确定要删除这个项目吗？这将同时删除所有相关任务。')) {
      await deleteProject(id);
    }
  };

  // 获取项目任务数量
  const getTaskCount = (projectId: string) => {
    return tasks.filter((task) => task.project_id === projectId).length;
  };

  // 获取项目已完成任务数量
  const getCompletedTaskCount = (projectId: string) => {
    return tasks.filter((task) => task.project_id === projectId && task.status === 'completed').length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">项目管理</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>添加项目</span>
        </button>
      </div>

      {/* 项目网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => {
            const totalTasks = getTaskCount(project.id);
            const completedTasks = getCompletedTaskCount(project.id);
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return (
              <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Folder className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setShowEditModal(true);
                      }}
                      className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                )}
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">进度</span>
                    <span className="font-medium text-gray-900">{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <CheckSquare className="h-4 w-4" />
                    <span>{completedTasks}/{totalTasks} 任务</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>团队：1人</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
            <Folder className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无项目</h3>
            <p className="text-gray-600 mb-4">创建您的第一个项目开始使用</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>添加项目</span>
            </button>
          </div>
        )}
      </div>

      {/* 添加项目弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">添加新项目</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目描述"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑项目弹窗 */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">编辑项目</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                <textarea
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入项目描述"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleEditProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;