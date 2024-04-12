import {lazy,Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {Route,RouterProvider,createBrowserRouter,createRoutesFromElements} from 'react-router-dom';
import './index.css';
import Layout from "./Layout.jsx";
console.log("Routes.jsx");



const App = lazy(() => import('./App.jsx'));
const UnderWorkingPage = lazy(() => import("./components/UnderWorkingPage.jsx"));
const ErrorPage = lazy(() => import('./components/ErrorPage.jsx'));

const router = createBrowserRouter(
    createRoutesFromElements(

        <Route path='/' element={<Layout />}>
            <Route path='' element={<App />} />

            {/*/!* Language *!/*/}
            {/*<Route path='language' element={<Language />} />*/}
            {/*<Route path='language/kumaoni' element={<Kumaoni />} />*/}
            {/*<Route path='language/garhwali' element={<Garhwali />} />*/}


            {/*/!* Useful Links *!/*/}
            {/*<Route path='/login' element={<Login />} />*/}
            {/*<Route path='map' element={<Map />} />*/}
            {/*<Route path='contact' element={<Contact/>} />*/}
            {/*<Route path='about' element={<About/>} />*/}
            {/*<Route path='contribution' element={<Contribution/>} />*/}
            {/*<Route path='contributors' element={<Contributor/>} />*/}

            {/* Error */}
            <Route path='*' element={<ErrorPage />} />
        </Route>
    )
);
ReactDOM.createRoot(document.getElementById('root')).render(
    <Suspense fallback={<div className={"loading"}> <img src={"/loading.svg"}/> </div>}>
        <RouterProvider router={router} />
    </Suspense>
);
