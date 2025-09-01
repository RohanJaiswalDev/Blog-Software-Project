import React from 'react';
import { Calendar, Clock, Heart, Edit2, Trash2, Share2, Download, Tag } from 'lucide-react';
import { BlogPost } from '../../types';
import { Button } from '../ui/Button';
import { formatFileSize, getFileIcon, downloadFile } from '../../utils/fileUtils';
import { formatDate } from '../../utils/storage';

interface BlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onShare: (post: BlogPost) => void;
  onLike: (id: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onEdit,
  onDelete,
  onShare,
  onLike
}) => {
  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200">
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="font-medium">{post.author}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onEdit(post)}
              variant="ghost"
              size="sm"
              icon={Edit2}
            />
            <Button
              onClick={() => onShare(post)}
              variant="ghost"
              size="sm"
              icon={Share2}
            />
            <Button
              onClick={() => onDelete(post.id)}
              variant="ghost"
              size="sm"
              icon={Trash2}
              className="text-red-500 hover:text-red-700"
            />
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Attachments ({post.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {post.attachments.slice(0, 4).map((attachment) => (
                <div
                  key={attachment.id}
                  onClick={() => downloadFile(attachment)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group/file"
                >
                  <span className="text-lg mr-3">{getFileIcon(attachment.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover/file:text-blue-600">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover/file:text-blue-600 opacity-0 group-hover/file:opacity-100 transition-all" />
                </div>
              ))}
              {post.attachments.length > 4 && (
                <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  +{post.attachments.length - 4} more files
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group/like"
          >
            <Heart className="w-5 h-5 group-hover/like:fill-current" />
            <span className="font-medium">{post.likes}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onEdit(post)}
              variant="secondary"
              size="sm"
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};