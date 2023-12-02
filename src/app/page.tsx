"use client";

import { useState, useMemo } from "react";

import { ConfigProvider, Flex, Card, Menu } from "antd";

import RootProvider, { RootItems as items } from "@/providers/RootProvider";

import Article from "@/components/home/Article";

const Home = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([items[0].key]);

  const current = useMemo(
    () => items.find((item) => selectedKeys.includes(item.key)) ?? items[0],
    [selectedKeys]
  );

  const currentDom = useMemo(() => {
    switch (current.key) {
      case "article":
        return <Article />;
      default:
        return null;
    }
  }, [current]);

  return (
    <RootProvider>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedBg: "#eee7ac",
              itemSelectedColor: "#000",
              itemBorderRadius: 20,
              itemMarginBlock: 0,
              activeBarBorderWidth: 0,
            },
          },
        }}
      >
        <Flex className="h-full" gap={10} vertical>
          <h3 className="flex items-center text-lg font-bold before:block before:bg-[#d3c029] before:mr-2 before:w-3 before:h-1 before:rounded">
            {current.label}
          </h3>
          <Card
            className="flex-1"
            bodyStyle={{ padding: "16px 10px", height: "100%" }}
          >
            <Flex className="h-full" gap={30}>
              <Menu
                className="space-y-8"
                items={items}
                selectedKeys={selectedKeys}
                onSelect={({ selectedKeys }) => setSelectedKeys(selectedKeys)}
              />
              <section className="flex-1 pr-2 overflow-y-auto">
                {currentDom}
              </section>
            </Flex>
          </Card>
        </Flex>
      </ConfigProvider>
    </RootProvider>
  );
};

export default Home;
