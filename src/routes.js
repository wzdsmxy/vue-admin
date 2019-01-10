import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import buyBTC from './views/nav1/buyBTC.vue';

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'routers.1',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/buyBTC', component: buyBTC, name: 'routers.1-1', hidden: true },
            { path: '/buyBTC', component: buyBTC, name: 'routers.1-2' },
            { path: '/form', component: Form, name: 'routers.1-3' },
            { path: '/user', component: user, name: 'routers.1-4' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'routers.2',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: 'routers.页面4' },
            { path: '/page5', component: Page5, name: 'routers.页面5' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '3',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: 'routers.3' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'routers.4',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'routers.echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;