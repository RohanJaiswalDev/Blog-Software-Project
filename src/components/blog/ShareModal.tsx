import React from 'react';
import { Copy, Mail, MessageCircle, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';
import { BlogPost } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const [copied, setCopied] = React.useState(false);
  const postUrl = `${window.location.origin}/post/${post.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyToClipboard,
      color: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(post.title);
        const body = encodeURIComponent(`Check out this blog post: ${postUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      },
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        const text = encodeURIComponent(`Check out this blog post: ${post.title} - ${postUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      },
      color: 'bg-green-100 hover:bg-green-200 text-green-800'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        const text = encodeURIComponent(`${post.title} - ${postUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      },
      color: 'bg-sky-100 hover:bg-sky-200 text-sky-800'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
      },
      color: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => {
        const url = encodeURIComponent(postUrl);
        const title = encodeURIComponent(post.title);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
      },
      color: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Post">
      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
          <div className="flex items-center text-xs text-gray-500">
            <span>By {post.author}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${option.color}`}
            >
              <option.icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={postUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <Button
              onClick={copyToClipboard}
              variant="secondary"
              size="sm"
              icon={copied ? Check : Link}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};