import { useState } from 'react';
import { useStore } from '../lib/store';
import { CheckSquare, Mail, Lock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import const { user, tasks, projects, isLoading, fetchTasks, fetchProjects, checkAuth } = useStore();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <CheckSquare className="h-8 w-8 text-blue-600 mx-auto" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* High Priority tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">查看全部
            </a>
          )}
        )}

      )}

    </div>
  </div>
</div>