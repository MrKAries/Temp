import { useRef, useState, useReducer, useCallback, useEffect } from "react";

import {
  Flex,
  Space,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Table,
  Modal,
  message,
} from "antd";

import dayjs from "dayjs";

import { CSSTransition } from "react-transition-group";

enum StatusType {
  ENABLE = "enable",
  DISABLE = "disable",
}

interface DataType {
  id: string;
  title: string;
  status: StatusType;
  createTime: number;
}

enum SearchActionType {
  TODO = "todo",
  REST = "rest",
}

type SearchAction =
  | { type: SearchActionType.TODO; payload: Partial<DataType> }
  | { type: SearchActionType.REST };

const STORAGETITLE = "article";

const Article = () => {
  const nodeRef = useRef(null);

  const [isAdd, setIsAdd] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [editorRecord, setEditorRecord] = useState<{
    open: boolean;
    record?: DataType;
  }>({
    open: false,
  });

  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const searchReducer = (state: Partial<DataType>, action: SearchAction) => {
    switch (action.type) {
      case SearchActionType.TODO:
        const { payload } = action;
        return { ...state, ...payload };
      case SearchActionType.REST:
        return {};
      default:
        throw new Error();
    }
  };

  const [search, dispatch] = useReducer(searchReducer, {});

  const columns = [
    { dataIndex: "id", title: "品类ID" },
    {
      dataIndex: "title",
      title: "品类名称",
    },
    {
      dataIndex: "status",
      title: "品类状态",
      render: (text: string) => {
        switch (text) {
          case StatusType.ENABLE:
            return "启用";
          case StatusType.DISABLE:
            return "冻结";
          default:
            return null;
        }
      },
    },
    {
      dataIndex: "createTime",
      title: "创建日期",
      sorter: (a: DataType, b: DataType) => a.createTime - b.createTime,
      render: (text: number) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      dataIndex: "status",
      title: "操作",
      render: (text: StatusType, record: DataType) => (
        <Space>
          <Button
            type="link"
            onClick={() =>
              setEditorRecord({ open: true, record: { ...record } })
            }
          >
            编辑
          </Button>
          {text === StatusType.ENABLE && (
            <Button
              type="link"
              onClick={() =>
                Modal.confirm({
                  title: "确认冻结？",
                  onOk: () => onChange(record.id),
                })
              }
            >
              冻结
            </Button>
          )}
          {text === StatusType.DISABLE && (
            <Button
              type="link"
              onClick={() =>
                Modal.confirm({
                  title: "确认启用？",
                  onOk: () => onChange(record.id),
                })
              }
            >
              启用
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const [form] = Form.useForm();

  const loadData = () => {
    const storageData = localStorage.getItem(STORAGETITLE);
    if (storageData) {
      return JSON.parse(storageData) as DataType[];
    }
    return null;
  };

  const onSearch = useCallback(() => {
    const { id, title, status, createTime } = search;
    const data = loadData();
    if (data) {
      setDataSource(
        data
          .filter((item) => item.id.includes(id ?? ""))
          .filter((item) => item.title.includes(title ?? ""))
          .filter((item) => (status ? item.status === status : true))
          .filter((item) =>
            createTime ? dayjs(item.createTime).isSame(createTime, "day") : true
          )
      );
    }
  }, [search, dataSource]);

  const onDelete = useCallback(() => {
    const data = [...dataSource];
    for (let key of selectedRowKeys) {
      const index = data.findIndex((item) => item.id === key);
      if (index != -1) {
        data.splice(index, 1);
      }
    }
    localStorage.setItem(STORAGETITLE, JSON.stringify(data));
    setDataSource(data);
    setSelectedRowKeys([]);
  }, [dataSource, selectedRowKeys]);

  const onChange = useCallback(
    (id: string) => {
      const data = [...dataSource];
      data.forEach((item) => {
        if (item.id === id) {
          item.status =
            item.status === StatusType.ENABLE
              ? StatusType.DISABLE
              : StatusType.ENABLE;
        }
      });
      localStorage.setItem(STORAGETITLE, JSON.stringify(data));
      setDataSource(data);
    },
    [dataSource]
  );

  useEffect(() => {
    if (Object.keys(search).length === 0) {
      const data = loadData();
      if (data) {
        return setDataSource(data);
      }
    }
  }, [search]);

  return (
    <>
      {showAdd && (
        <Flex className="h-full" justify="space-between" vertical>
          <Flex gap={20} vertical>
            <h5 className="pl-4 font-semibold">添加品类</h5>
            <Form
              labelAlign="left"
              labelCol={{ flex: "80px" }}
              wrapperCol={{ span: 6 }}
              form={form}
              onFinish={(values) => {
                const data = {
                  ...values,
                  status: "disable",
                  createTime: Date.now(),
                };
                localStorage.setItem(
                  STORAGETITLE,
                  JSON.stringify([...dataSource, data])
                );
                setDataSource((state) => [...state, data]);
                setIsAdd(false);
              }}
            >
              <Form.Item name="id" label="品类ID" rules={[{ required: true }]}>
                <Input placeholder="请输入品类ID" />
              </Form.Item>
              <Form.Item
                name="title"
                label="品类名称"
                rules={[{ required: true }]}
              >
                <Input placeholder="请输入品类名称" />
              </Form.Item>
            </Form>
          </Flex>
          <Flex className="pb-8" justify="center" gap={30}>
            <Button onClick={() => setIsAdd(false)}>取消</Button>
            <Button onClick={() => form.submit()}>保存并创建</Button>
          </Flex>
        </Flex>
      )}
      <CSSTransition
        classNames="toggle-add"
        in={!isAdd}
        nodeRef={nodeRef}
        timeout={300}
        unmountOnExit
        onEnter={() => setShowAdd(false)}
        onExited={() => setShowAdd(true)}
      >
        <Flex ref={nodeRef} gap={10} vertical>
          <Flex className="[&>*]:flex-1" justify="space-between" gap={10}>
            <Input
              placeholder="请输入品类ID"
              value={search.id}
              onChange={(e) =>
                dispatch({
                  type: SearchActionType.TODO,
                  payload: { id: e.target.value },
                })
              }
            />
            <Input
              placeholder="请输入品类名称"
              value={search.title}
              onChange={(e) =>
                dispatch({
                  type: SearchActionType.TODO,
                  payload: { title: e.target.value },
                })
              }
            />
            <DatePicker
              placeholder="请选择创建日期"
              value={search.createTime ? dayjs(search.createTime) : null}
              onChange={(date) => {
                dispatch({
                  type: SearchActionType.TODO,
                  payload: { createTime: date?.valueOf() },
                });
              }}
            />
            <Select
              placeholder="请选择品类状态"
              options={[
                { value: StatusType.ENABLE, label: "启用" },
                { value: StatusType.DISABLE, label: "冻结" },
              ]}
              value={search.status}
              onSelect={(value) =>
                dispatch({
                  type: SearchActionType.TODO,
                  payload: { status: value },
                })
              }
            />
          </Flex>
          <Space>
            <Button onClick={onSearch}>搜索</Button>
            <Button
              type="text"
              icon={
                <svg className="icon">
                  <use xlinkHref="#icon-qingchu" />
                </svg>
              }
              onClick={() => dispatch({ type: SearchActionType.REST })}
            >
              清除条件
            </Button>
          </Space>
          <Space>
            <Button type="primary" onClick={() => setIsAdd(true)}>
              添加品类
            </Button>
            <span>已选 {selectedRowKeys.length}</span>
            <Button
              type="link"
              disabled={selectedRowKeys.length === 0}
              onClick={() =>
                Modal.confirm({
                  title: "确认删除？",
                  onOk: onDelete,
                })
              }
            >
              批量删除
            </Button>
          </Space>
          <Table
            size="small"
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            pagination={{
              position: ["bottomCenter"],
              total: dataSource.length,
              showTotal: (total) => `共${total}条数据`,
              itemRender: (_, type, originalElement) => {
                switch (type) {
                  case "prev":
                    return <a className="pr-2">上一页</a>;
                  case "next":
                    return <a className="pl-2">下一页</a>;
                  default:
                    return originalElement;
                }
              },
            }}
          />
        </Flex>
      </CSSTransition>
      <Modal
        title="品类编辑"
        width={440}
        open={editorRecord.open}
        onCancel={() => setEditorRecord({ open: false })}
        onOk={() => {
          const data = [...dataSource];
          const { record } = editorRecord;
          if (!record?.title) {
            message.error("品类名称不能为空！");
            return;
          }
          data.forEach((item) => {
            if (item.id === record.id) {
              item.title = record.title;
            }
          });
          localStorage.setItem(STORAGETITLE, JSON.stringify(data));
          setDataSource(data);
          setEditorRecord({ open: false });
        }}
      >
        <Space>
          <label htmlFor="">品质名称</label>
          <Input
            value={editorRecord.record?.title}
            onChange={(e) => {
              setEditorRecord((state) => {
                const { record } = state;
                if (record) {
                  record.title = e.target.value;
                }
                return { ...state };
              });
            }}
          />
        </Space>
      </Modal>
    </>
  );
};

export default Article;
