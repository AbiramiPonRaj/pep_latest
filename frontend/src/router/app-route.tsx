import { BrowserRouter as Router, Navigate, Route, Routes, } from "react-router-dom";
import { Suspense } from "react";
import HomePage from "../pages/home-page/home-page";
import Header from "../layouts/header/header";
import Dashboard from "../pages/dashboard-page/dashboard";
import ChangePassword from "../pages/change-password/changepassword";
import AdminUser from "../pages/Masters/Adminuser/adminuser";
import AddEmp from "../pages/Masters/Adminuser/addemp";
import Country from "../pages/Masters/Country";
import State from "../pages/Masters/State";
import City from "../pages/Masters/City";
import RelativeType from "../pages/Masters/RelativeType";
import Admingroup from "../pages/Masters/AdminGroup/Admingroup";
import Adminuserrights from "../pages/Adminuserrights/Adminuserrights";
import Login from "../pages/login/login";
import Details from "../pages/Details/Details";
import View from "../pages/Details/View";
import Edit from "../pages/Details/Edit";
import TaskAssign from "../pages/TaskAssign/taskAssign";
import DataEntry from "../pages/Reports/DataEntry";
import QcView from "../pages/Reports/QcView";
import QcPending from "../pages/Reports/QcPending";
import QcEdit from "../pages/Reports/QcEdit";
import ReassignTask from "../pages/Reports/ReassignTask";
import ManagerPending from "../pages/Reports/ManagerPending";
import PublishedData from "../pages/Reports/PublishedData";
import CustomerEdit from "../pages/Reports/customerEdit";
import ManagerApprove from "../pages/Reports/ManagerApprove";
import Identify from "../pages/Details/Identify";
import SearchIdentify from "../pages/Details/searchIdentify";
import TaskAssignView from "../pages/TaskAssign/taskAssignView";
import ManagerSearch from "../pages/Details/ManagerSearch";
import ClientView from "../pages/Details/Client";
import ClientSearch from "../pages/Details/ClientSearch";
import QcPendingView from "../pages/Qc/QcPendingView";
import QcViewDate from "../pages/Qc/QcView";
import Manager from "../pages/Manager/Manager";
import ViewDesign from "../pages/Details/ViewDesign";
import RoleDetails from "../pages/RoleDetails/RoleDetails";
import Role from "../pages/RoleDetails/Role";
import CustomerSearch from "../pages/CustomerSearch/CustomerSearch";
import ManagerPendingView from "../pages/Manager/ManagerPendingView";
import CompanySearch from "../pages/Details/CompanySearch";
import DirectorEdit from "../pages/DirectorEdit/DirectorEdit";
import SessionTimeoutHandler from "../pages/InActivity/useInactivityTimeout";
import DinNameEdit from "../pages/DirectorEdit/DinNameEdit";

const isAuthenticated = () => {
    const loginDetails = sessionStorage.getItem('loginDetails') || localStorage.getItem('loginDetails');
    return loginDetails !== null;
};

const AppRouter = () => {
    return <>
        <Suspense fallback={<span>Loading....</span>}>
            <Router>
            <SessionTimeoutHandler />
                <Routes>
                    <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/changePassword" element={<ChangePassword />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/adminuser" element={<AdminUser />} />
                    <Route path="/addemp" element={<AddEmp />} />
                    <Route path="/Country" element={<Country />} />
                    <Route path="/State" element={<State />} />
                    <Route path="/City" element={<City />} />
                    <Route path="/RelativeType" element={<RelativeType />} />
                    <Route path="/Admingroup" element={<Admingroup />} />
                    <Route path="/Adminuserrights" element={<Adminuserrights />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/details" element={<Details />} />
                    <Route path="/Edit/:pepId/:uid" element={<Edit />} />
                    <Route path="/view/:pepId/:uid/" element={<View />} />
                    <Route path="/DataEntryReport" element={<DataEntry />} />
                    <Route path="/QcViewReport" element={<QcView />} />
                    <Route path="/QcEdit" element={<QcEdit />} />
                    <Route path="/ManagerApprove" element={<ManagerApprove />} />
                    <Route path="/ReassignTask" element={<ReassignTask />} />
                    <Route path="/QcPendingReport" element={<QcPending />} />
                    <Route path="/ManagerPending" element={<ManagerPending />} />
                    <Route path="/PublishedData" element={<PublishedData />} />
                    <Route path="/QcView" element={<CustomerEdit />} />
                    <Route path="/QcView/:pepId" element={<CustomerEdit />} />
                    <Route path="/taskAssign" element={<TaskAssign />} />
                    <Route path="/details" element={<Identify />} />
                    <Route path="/DataEntry" element={<SearchIdentify />} />
                    <Route path="/details/:taskId" element={<Identify />} />
                    <Route path="/Edit/:pepId" element={<Edit />} />
                    <Route path="/taskAssignView" element={<TaskAssignView />} />
                    <Route path="/ManagerView" element={<ManagerSearch />} />
                    <Route path="/ClientView/:pepId/:uid/:entity" element={< ClientView />} />
                    <Route path="/ClientView/:companyId/:uid/:entity" element={< ClientView />} />
                    <Route path="/ClientView/:pepId/:companyId/:uid/:entity" element={<ClientView />} />
                    <Route path="/ClientView" element={<ClientSearch />} />
                    <Route path="/QcViewData" element={<QcViewDate />} />
                    <Route path="/QcPending/:pepId/:uid" element={<QcPendingView />} />
                    <Route path="/ManagerPendingView" element={<ManagerPendingView />} />
                    <Route path="/QcPending" element={<QcPendingView />} />
                    <Route path="/Manager" element={<Manager />} />
                    <Route path="/Manager/:pepId/:uid" element={<Manager />} />
                    <Route path="/viewDesign/:pepId/:uid" element={<ViewDesign />} />
                    <Route path="/RoleDetails" element={<RoleDetails />} />
                    <Route path="/Role" element={<Role />} />
                    <Route path="/CustomerSearch" element={<CustomerSearch />} />
                    <Route path="/companySearch" element={<CompanySearch />} />
                    <Route path="/DirectorNameEdit" element={<DirectorEdit />} />
                    <Route path="/DinNameEdit" element={<DinNameEdit />} />
                </Routes>
            </Router>
        </Suspense>
    </>
}

export default AppRouter;