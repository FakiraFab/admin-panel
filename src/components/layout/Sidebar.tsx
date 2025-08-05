import {
  BoxIcon,
  FilePlusIcon,
  ImageIcon,
  LayersIcon,
  ShoppingCartIcon,
  VideoIcon,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  path?: string;
  subItems?: {
    title: string;
    path: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      icon: <ShoppingCartIcon className="w-6 h-6" />,
      title: "Products",
      subItems: [
        { title: "Product List", path: "/products" },
        { title: "Add Product", path: "/products/add" },
      ],
    },
    {
      icon: <LayersIcon className="w-6 h-6" />,
      title: "Categories",
      subItems: [
        { title: "Category List", path: "/categories" },
        { title: "Add Category", path: "/categories/add" },
      ],
    },
    {
      icon: <LayersIcon className="w-6 h-6" />,
      title: "Subcategories",
      subItems: [
        { title: "Subcategory List", path: "/subcategories" },
        { title: "Add Subcategory", path: "/subcategories/add" },
      ],
    },
    {
      icon: <BoxIcon className="w-6 h-6" />,
      title: "Orders",
      path: "/orders",
    },
    {
      icon: <FilePlusIcon className="w-6 h-6" />,
      title: "Workshops",
      subItems: [
        { title: "Workshop List", path: "/class-registration" },
        { title: "Registrations", path: "/registrations" },
      ],
    },
    {
      icon: <ImageIcon className="w-6 h-6" />,
      title: "Banners",
      path: "/banners",
    },
    {
      icon: <VideoIcon className="w-6 h-6" />,
      title: "Reels",
      subItems: [
        { title: "Reels List", path: "/reels" },
        { title: "Add Reel", path: "/reels/add" },
      ],
    },
  ];

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const isParentActive = (subItems?: { path: string }[]) => {
    if (!subItems) return false;
    return subItems.some(item => location.pathname.startsWith(item.path));
  };

  return (
    <nav className="w-[364px] h-full bg-white shadow-[2px_2px_25px_#00000014] flex flex-col">
      {/* Logo section */}
      <div className="h-[102px] border-b border-[#dadada] flex items-center justify-center">
        <img
          className="w-[59px] h-16 object-cover"
          alt="Logo"
          src="/img-3207-1.png"
        />
      </div>

      {/* Navigation menu */}
      <div className="flex flex-col w-full">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* Main menu item */}
            {item.path ? (
              <Link
                to={item.path}
                className={`flex items-center gap-2.5 px-10 py-4 w-full hover:bg-gray-50 transition-colors ${
                  isActiveRoute(item.path) ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                {item.icon}
                <div className={`font-semibold text-sm tracking-[0.07px] leading-5 whitespace-nowrap ${
                  isActiveRoute(item.path) ? 'text-blue-600' : 'text-[#1c1c1c]'
                }`}>
                  {item.title}
                </div>
              </Link>
            ) : (
              <div className={`flex items-center gap-2.5 px-10 py-4 w-full ${
                isParentActive(item.subItems) ? 'bg-blue-50' : ''
              }`}>
                {item.icon}
                <div className={`font-semibold text-sm tracking-[0.07px] leading-5 whitespace-nowrap ${
                  isParentActive(item.subItems) ? 'text-blue-600' : 'text-[#1c1c1c]'
                }`}>
                  {item.title}
                </div>
              </div>
            )}

            {/* Sub items */}
            {item.subItems?.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                to={subItem.path}
                className={`flex items-center gap-2.5 px-20 py-4 w-full hover:bg-gray-50 transition-colors ${
                  isActiveRoute(subItem.path) ? 'bg-red-50 border-r-4 border-red-500' : ''
                }`}
              >
                <div
                  className={`text-sm tracking-[0.07px] whitespace-nowrap font-semibold leading-5 ${
                    isActiveRoute(subItem.path) ? "text-[#9f0000]" : "text-[#979797]"
                  }`}
                >
                  {subItem.title}
                </div>
              </Link>
            ))}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};