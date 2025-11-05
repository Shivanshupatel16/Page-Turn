import { motion } from 'framer-motion';
import { ChartBarIcon, UserGroupIcon, BookOpenIcon, CurrencyDollarIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const DashboardLayout = ({ role, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-64 bg-white border-r border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <BookOpenIcon className="h-8 w-8 text-emerald-600" />
          <h2 className="text-xl font-semibold text-slate-800">PageTurn {role} Dashboard</h2>
        </div>
        
        <nav className="space-y-2">
          {role === 'admin' ? (
            <>
              <DashboardLink icon={ChartBarIcon} label="Analytics" />
              <DashboardLink icon={UserGroupIcon} label="User Management" />
              <DashboardLink icon={ShieldCheckIcon} label="Moderation" />
              <DashboardLink icon={CogIcon} label="System Settings" />
            </>
          ) : (
            <>
              <DashboardLink icon={BookOpenIcon} label="My Listings" />
              <DashboardLink icon={CurrencyDollarIcon} label="Transactions" />
              <DashboardLink icon={UserGroupIcon} label="Messages" />
              <DashboardLink icon={CogIcon} label="Account Settings" />
            </>
          )}
        </nav>
      </div>

      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

const DashboardLink = ({ icon: Icon, label }) => (
  <motion.button
    whileHover={{ x: 5 }}
    className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-emerald-600"
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </motion.button>
);


export const UserDashboard = () => (
  <DashboardLayout role="user">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-slate-800 mb-8">Welcome Back, Student!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard icon={CurrencyDollarIcon} title="Total Earnings" value="$1,240" />
        <StatsCard icon={BookOpenIcon} title="Active Listings" value="8 Books" />
        <StatsCard icon={ShieldCheckIcon} title="Items Sold" value="24 Books" />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem title="New offer received" date="2h ago" value="$45" />
          <ActivityItem title="Textbook sold" date="1 day ago" value="Computer Networks" />
          <ActivityItem title="New message" date="3 days ago" value="From John D." />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-emerald-500 text-white rounded-xl flex items-center gap-3"
        >
          <BookOpenIcon className="h-6 w-6" />
          <span className="text-lg">List New Book</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl flex items-center gap-3"
        >
          <CurrencyDollarIcon className="h-6 w-6" />
          <span className="text-lg">View Earnings</span>
        </motion.button>
      </div>
    </div>
  </DashboardLayout>
);

export const AdminDashboard = () => (
  <DashboardLayout role="admin">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold text-slate-800 mb-8">Platform Overview</h1>
  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard icon={UserGroupIcon} title="Total Users" value="2,458" trend="+12%" />
        <StatsCard icon={BookOpenIcon} title="Active Listings" value="1,843" trend="+8%" />
        <StatsCard icon={CurrencyDollarIcon} title="Transactions" value="$84,240" trend="+23%" />
        <StatsCard icon={ShieldCheckIcon} title="Reports" value="42" trend="-5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Users</h2>
          <DataTable
            headers={['Name', 'Joined', 'Status']}
            rows={[
              ['John Doe', '2024-03-15', 'Active'],
              ['Jane Smith', '2024-03-14', 'Verified'],
              ['Mike Johnson', '2024-03-13', 'Pending']
            ]}
          />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <AdminAction icon={ShieldCheckIcon} label="Verify New Users" count={3} />
            <AdminAction icon={BookOpenIcon} label="Review Listings" count={12} />
            <AdminAction icon={CogIcon} label="System Health" status="Optimal" />
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

const StatsCard = ({ icon: Icon, title, value, trend }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-600 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
      </div>
      <div className="p-3 bg-emerald-100 rounded-lg">
        <Icon className="h-6 w-6 text-emerald-600" />
      </div>
    </div>
    {trend && <span className={`text-sm ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{trend}</span>}
  </motion.div>
);

const ActivityItem = ({ title, date, value }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-slate-600 text-sm">{date}</p>
    </div>
    <span className="text-emerald-600 font-medium">{value}</span>
  </div>
);

const DataTable = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-slate-200">
          {headers.map((header) => (
            <th key={header} className="text-left p-3 text-slate-600">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-slate-100">
            {row.map((cell, j) => (
              <td key={j} className="p-3 text-slate-800">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AdminAction = ({ icon: Icon, label, count, status }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
  >
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-emerald-600" />
      <span className="text-slate-800">{label}</span>
    </div>
    {count && <span className="bg-emerald-500 text-white px-2 rounded-full">{count}</span>}
    {status && <span className="text-emerald-600">{status}</span>}
  </motion.div>
);

