# react-router实现和基本使用
## 路由的本质
路由器主要维护的是一个映射表，映射表会决定数据的流向。
### 后端路由阶段
早期的网站开发整个HTML页面是由服务器来渲染的。服务器直接生产渲染好对应的HTML页面, 返回给客户端进行展示。当我们页面中需要请求不同的路径内容时, 交给服务器来进行处理, 服务器渲染好整个页面, 并且将页面返回给客户端
### 前后端分离阶段
每次请求涉及到的静态资源都会从静态资源服务器获取，这些资源包括HTML+CSS+JS，然后在前端对这些请求回来的资源进行渲染。后端只提供API来返回数据，是前后端责任的清晰，后端专注于数据上，前端专注于交互和可视化上。并且当移动端(iOS/Android)出现后，后端不需要进行任何处理，依然使用之前的一套API即可。
### 单页面富应用（SPA）阶段
实SPA最主要的特点就是在前后端分离的基础上加了一层前端路由，前端来维护一套路由规则。
## 前端路由
### 前端路由核心：
改变URL，但是页面不进行整体的刷新。
### 前端路由实现：
监听URL的改变实现URL和内容映射。
#### URL的hash
也就是锚点(#), 本质上是改变window.location的href属性。我们可以通过直接赋值location.hash来改变href, 但是页面不发生刷新。
优势就是兼容性更好，在老版IE中都可以运行，但是缺陷是有一个#，显得不像一个真实的路径。
#### HTML5的History
history接口是HTML5新增的, 它有六种模式改变URL而不刷新页面：
- replaceState：替换原来的路径；
- pushState：使用新的路径；
- popState：路径的回退；
- go：向前或向后改变路径；
- forward：向前改变路径；
- back：向后改变路径；
## react-router的基本使用
Router中包含了对路径改变的监听，并且会将相应的路径传递给子组件。
- BrowserRouter使用history模式。
- HashRouter使用hash模式。
### 路由映射配置和跳转
- Routes：
  
  包裹所有的Route，在其中匹配一个路由。
- Link和NavLink：
  
    - 通常路径的跳转是使用Link组件，最终会被渲染成a元素；
    - NavLink是在Link基础之上增加了一些样式属性;
    - to属性：Link中最重要的属性，用于设置跳转到的路径；

        ```jsx
        <div className="nav">Add commentMore actions
                                    <Link to={'/home'}>首页</Link>
                                    <Link to={`/about/${id}`}>关于</Link>

                                </div>

                            </div>
                            <div className="content">
                                <Routes>
                                    <Route path='/' element={<Navigate to="/home" />} />
                                    <Route path='/home' element={<Home />} >
                                    //子路由嵌套
                                        <Route path='/home' element={<Navigate to="/home/homerecommed" />}></Route>
                                        <Route path='/home/homeindex' element={<Homeindex />}></Route>
                                        <Route path='/home/homerecommed' element={<HomeREcommend />}></Route>
                                    </Route>
                                    <Route path='/about/:id' element={<About />} />
                                    <Route path='*' element={<NotFound />}></Route>
                                </Routes>
                            </div>
        ```
- Navigate导航：
  
  Navigate用于路由的重定向，当这个组件出现时，就会执行跳转到对应的to路径中
    ```jsx
    <Route path="/" element={<Navigate to="/home"/>}></Route>
    ```
- Not Found页面配置:
- 
  如果用户随意输入一个地址，该地址无法匹配，那么在路由匹配的位置将什么内容都不显示。
  ```jsx
  <Route path='*' element={<NotFound/>}/>
  ```
- 路由的嵌套:
  
  **配置文件的写法**
  ```jsx
  path: '/home',Add commentMore actions
        element: <Home />,
        Children: [
            {
                path: '/home',
                element: <Navigate to="/home/homerecommed" />
            },]
  ```
  **普通写法**
  见上注释处
- 手动路由的跳转:
  
  如果我们希望进行代码跳转，需要通过useNavigate的Hook获取到navigate对象进行操作
- 路由参数传递:
  
  1. 动态路由
    将path在Route匹配时写成/detail/:id，那么 /detail/abc、/detail/123都可以匹配到该Route，并且进行显示。
  2. search传递参数
    ```jsx
    <Link to="user?name=zmy&age=18">用户信息</Link>
    ```
- 路由的配置文件:
  
    将所有的路由配置放到一个地方进行集中管理。
    ```jsx
    import { Navigate } from 'react-router-dom'Add commentMore actions
    import Homeindex from '../Components/Homeindex'
    import HomeREcommend from '../Components/HomeREcommend'
    import NotFound from '../Components/NotFound'
    import Home from '../Components/Home'
    const About = React.lazy(() => import('../Components/About'))
    const routes = [
        {
            path: '/',
            element: <Navigate to="/home" />
        },
        {
            path: '/home',
            element: <Home />,
            Children: [
                {
                    path: '/home',
                    element: <Navigate to="/home/homerecommed" />
                },
                {
                    path: '/home/homeindex',
                    element: <Homeindex />
                },
                {
                    path: '/home/homerecommed',
                    element: <HomeREcommend />
                },

            ]
        },
        {
            path: '/about/:id',
            element: <About />
        },
        {
            path: '*',
            element: <NotFound />
        },

    ]
    export default routes
    ```
[一些相关代码](https://github.com/ManMan3392/redrockhomework/commit/95537d74041ab369d4a01e037fe7d6c38fed0b3c#diff-4f0fca01d900ebdc989cfa3ff5ed1d2bd41b1c4865c49733391922c9617711f0)