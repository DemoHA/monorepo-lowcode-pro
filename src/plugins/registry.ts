import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import ComponentsPane from '@alilc/lowcode-plugin-components-pane';
import { Logo } from '../components/logo/logo';
import { PagesPane } from '../components/pages/index';

const builtinPluginRegistry = (ctx: IPublicModelPluginContext) => {
  return {
    name: 'builtin-plugin-registry',
    async init() {
      const { skeleton, project } = ctx;
      // 注册 logo 面板
      skeleton.add({
        area: 'topArea',
        type: 'Widget',
        name: 'logo',
        content: Logo,
        contentProps: {
          logo: 'https://img.alicdn.com/imgextra/i4/O1CN013w2bmQ25WAIha4Hx9_!!6000000007533-55-tps-137-26.svg',
          href: 'https://lowcode-engine.cn',
        },
        props: {
          align: 'left',
        },
      });

      // 注册组件面板
      const componentsPane = skeleton.add({
        area: 'leftArea',
        type: 'PanelDock',
        name: 'componentsPane',
        content: ComponentsPane,
        props: {
          align: 'top',
          icon: 'zujianku',
          description: '组件库',
        },
      });
      componentsPane.disable();
      project.onSimulatorRendererReady(() => {
        componentsPane.enable();
      });
      // 注册页面管理面板
      skeleton.add({
        index: -1,
        area: 'leftArea',
        type: 'PanelDock',
        name: 'pagesPane',
        content: PagesPane,
        contentProps: {},
        props: {
          align: 'top',
          icon: 'kaiwenjianjia',
          description: '页面管理',
        },
      });
    },
  };
};

builtinPluginRegistry.pluginName = 'builtinPluginRegistry';

export default builtinPluginRegistry;
