import './Dashboard.css'
const Dashboard: React.FC = () => {
    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logged out");
    };
    return (
        <>
            <nav className="navbar">
                <div className="navbar-title">Dashboard</div>
                <div className="logout-icon" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                </div>
            </nav>
            <div className="dashboard-content">
                Hello Dashboard!
            </div>
        </>
    )

}

export default Dashboard;