import React, { FC, ReactElement, useState } from 'react';
import { Menu, Dialog, Form, Input, Radio } from '@alifd/next';
import { PluginProps } from '@alilc/lowcode-types';
import './index.less';

const { SubMenu, Item } = Menu;
const initdatas = [
  {
    name: 'Index',
    title: '首页',
    path: '/',
  },
  {
    name: 'Login',
    title: '登录页',
    path: '/login',
  },
  {
    name: '404',
    title: '404页',
    path: '/404',
  },
  {
    name: 'Monitor',
    title: '系统监控',
    path: '/monitor',
    children: [
      {
        name: 'MonitorStatus',
        title: '全局监控',
        path: 'monitorStatus',
      },
      {
        name: 'MonitorWorking',
        title: '组件监控',
        path: 'monitorWorking',
      },
    ],
  },
  {
    name: 'UserManagement',
    title: '用户管理',
    path: '/userManagement',
    children: [
      {
        name: 'OptManager',
        title: '操作管理',
        path: 'monitorStatus',
      },
      {
        name: 'Logs',
        title: '日志',
        path: 'logs',
        children: [
          {
            name: 'OptLogs',
            title: '操作日志',
            path: 'optLogs',
          },
          {
            name: 'OtherLogs',
            title: '其他日志',
            path: 'otherLogs',
          },
        ],
      },
    ],
  },
];
const formItemLayout = {
  labelCol: {
    fixedSpan: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

export const PagesPane: FC<PluginProps> = (): ReactElement => {
  const [datas, setDatas] = useState(initdatas);
  const handleItemSelect = (selectedKeys: any) => {
    console.log('selectedKeys ===', selectedKeys);
  };
  // 创建页面
  const createFile = (key: string, path: any) => {
    const redata = [...datas];
    let res = redata as any[];
    const dataPathArray = path.split('-');
    console.log('dataPathArray====', dataPathArray);
    // 数组某个位置插入一个元素
    for (let index = 0, len = dataPathArray.length; index < len; index++) {
      const item = dataPathArray[index];
      if (index === len - 1) {
        const pageInfo = {
          name: 'newPage0',
          path: 'newPage0',
          title: '新页面' + path,
        };
        const inserKey = Number(item) + Number(key);
        if (inserKey < 0) {
          res.unshift(pageInfo);
        } else if (inserKey >= res.length - 1) {
          res.push(pageInfo);
        } else {
          res.splice(Number(item), 0, pageInfo);
        }

        console.log('res====', res);
        return;
      }
      res = res[item].children;
      console.log('res====', res);
    }
    console.log('redata=====', redata);
    // switch (key) {
    //   case '-1':

    //     break;

    //   default:
    //     break;
    // }
  };
  const handleContextmenuItemClick = (key: string, data: any) => {
    // console.log(key, data);
    Dialog.show({
      v2: true,
      title: 'Quick',
      footer: ' ',
      content: (
        <Form {...formItemLayout} colon>
          <Form.Item
            name="name"
            label="文件名"
            required
            requiredMessage="Please input your username!"
          >
            <Input name="name" />
          </Form.Item>
          <Form.Item
            name="locator"
            label="路由"
            required
            requiredMessage="Please input your username!"
          >
            <Input name="locator" />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            required
            requiredMessage="Please input your password!"
          >
            <Radio.Group
              name="type"
              shape="button"
              dataSource={[
                {
                  label: '文件夹',
                  value: 1,
                },
                {
                  label: '文件',
                  value: 2,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Form.Submit
              type="primary"
              validate
              onClick={() => createFile(key, data)}
              style={{ marginRight: 8 }}
            >
              创建
            </Form.Submit>
            <Form.Reset>重置</Form.Reset>
          </Form.Item>
        </Form>
      ),
    });
  };
  // 每项右击
  const handleContextmenu = (e: any, data: any) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const { top, left } = target.getBoundingClientRect();
    Menu.create({
      target: e.target,
      offset: [e.clientX - left, e.clientY - top],
      className: 'context-menu',
      popupClassName: 'context-menu',
      onItemClick: (key: string) => handleContextmenuItemClick(key, data),
      defaultOpenKeys: '0',
      selectMode: 'multiple',
      children: [
        <Item key="-1">在上面新建页面</Item>,
        <Item key="0">创建子页面</Item>,
        <Item key="1">在下面创建页面</Item>,
      ],
    });
  };
  // 渲染子页面
  const reRenderItems = (data: any, index: number, baseKey: string) => {
    const title = data.title || `新的页面${index}`;
    const key = baseKey ? `${baseKey}-${index}` : `${index}`;
    if (!data.children || !data.children.length) {
      return (
        <Item key={key} onContextMenu={(e) => handleContextmenu(e, key)}>
          {title}
        </Item>
      );
    }
    return (
      <SubMenu key={key} label={title} onContextMenu={(e) => handleContextmenu(e, key)}>
        {data.children.map((subData: any, i: number) => reRenderItems(subData, i, key))}
      </SubMenu>
    );
  };
  return (
    <div className="lowcode-plugin-pages">
      <Menu openMode="single" defaultOpenKeys="0" onSelect={handleItemSelect}>
        {datas.map((data, index) => reRenderItems(data, index, ''))}
      </Menu>
    </div>
  );
};
PagesPane.displayName = 'PagesPane';
