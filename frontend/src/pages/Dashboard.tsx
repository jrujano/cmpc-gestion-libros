const Dashboard = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Widgets or summary cards */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">Total Books</h3>
            <p className="text-3xl font-bold mt-2">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">Available Books</h3>
            <p className="text-3xl font-bold mt-2">876</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-medium text-gray-900">Active Users</h3>
            <p className="text-3xl font-bold mt-2">256</p>
          </div>
        </div>
  
        {/* Recent activity section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;