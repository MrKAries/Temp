import { createContext, useContext } from "react";

type RootItemKey = "article" | "category" | "wares" | "logistics";

export const RootItems: Array<{ key: RootItemKey; label: string }> = [
  { key: "article", label: "品类管理" },
  { key: "category", label: "类目管理" },
  { key: "wares", label: "商品管理" },
  { key: "logistics", label: "物流管理" },
];

interface ContextType {}

const RootContext = createContext<ContextType>({
  selectedKey: RootItems[0].key,
});

export const useRoot = () => useContext(RootContext);

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return <RootContext.Provider value={{}}>{children}</RootContext.Provider>;
};

export default RootProvider;
