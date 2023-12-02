"use client";

import { useState, useEffect } from "react";

import { usePathname } from "next/navigation";

import Link from "next/link";

import {
  ConfigProvider,
  Layout,
  Menu,
  Flex,
  Space,
  Dropdown,
  Avatar,
} from "antd";
import {
  UserOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import zh_CN from "antd/locale/zh_CN";

import menus from "@/assets/menus.json";

const { Header, Sider, Content } = Layout;

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    const key = pathname.split("/")?.[1];
    setSelectedKeys([!!key ? key : "home"]);
  }, [pathname]);

  return (
    <ConfigProvider
      locale={zh_CN}
      theme={{
        components: {
          Layout: { headerBg: "#fff", siderBg: "#fff" },
          Menu: {
            itemActiveBg: "rgba(0, 0, 0, 0.06)",
            itemSelectedBg: "rgba(0, 0, 0, 0.06)",
            itemSelectedColor: "#d3c029",
            itemMarginInline: 0,
            itemPaddingInline: 0,
            itemBorderRadius: 0,
            itemHeight: 32,
          },
        },
      }}
    >
      <Layout className="h-screen">
        <Header className="leading-normal">
          <Flex className="h-full" align="center" justify="space-between">
            <Link href="/">
              <h1 className="text-2xl text-black font-bold">日上</h1>
            </Link>
            <Dropdown
              open={open}
              menu={{
                items: [
                  { key: "1", label: <span>修改密码</span> },
                  { key: "2", label: <span>退出登录</span> },
                ],
              }}
              onOpenChange={(open) => setOpen(open)}
            >
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <Space
                  className="text-xs font-bold"
                  direction="vertical"
                  size={0}
                >
                  <span>管理员&#44;</span>
                  <span>您好</span>
                </Space>
                {open ? <CaretUpOutlined /> : <CaretDownOutlined />}
              </Space>
            </Dropdown>
          </Flex>
        </Header>
        <Layout hasSider>
          <Sider className="py-2">
            <Menu
              items={menus.map((menu) => ({
                ...menu,
                icon: (
                  <svg className="icon">
                    <use xlinkHref={`#icon-${menu.icon}`} />
                  </svg>
                ),
                label: (
                  <Link href={menu.key === "home" ? "/" : `/${menu.key}`}>
                    {menu.label}
                  </Link>
                ),
              }))}
              selectedKeys={selectedKeys}
              onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
            />
          </Sider>
          <Content className="p-2 overflow-hidden">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default BasicLayout;
