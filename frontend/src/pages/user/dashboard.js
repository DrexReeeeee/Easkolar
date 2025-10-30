import React from "react";
import { 
  FiAward, 
  FiBookmark, 
  FiTrendingUp, 
  FiCalendar,
  FiDollarSign,
  FiCheckCircle
} from "react-icons/fi";
import "./styles/dashboard.css";

export default function Dashboard() {
  // Mock data - replace with actual API data later
  const stats = [
    {
      icon: FiAward,
      label: "Available Scholarships",
      value: "1,234",
      change: "+12%",
      trend: "up"
    },
    {
      icon: FiBookmark,
      label: "Bookmarked",
      value: "23",
      change: "+5",
      trend: "up"
    },
    {
      icon: FiCheckCircle,
      label: "Applications Submitted",
      value: "8",
      change: "+2",
      trend: "up"
    },
    {
      icon: FiDollarSign,
      label: "Potential Awards",
      value: "$45,600",
      change: "+$2,400",
      trend: "up"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Applied for",
      scholarship: "STEM Excellence Scholarship",
      date: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      action: "Bookmarked",
      scholarship: "Women in Tech Grant",
      date: "1 day ago",
      status: "saved"
    },
    {
      id: 3,
      action: "Application approved for",
      scholarship: "Community Leadership Award",
      date: "3 days ago",
      status: "approved"
    }
  ];

  const recommendedScholarships = [
    {
      id: 1,
      title: "Academic Excellence Scholarship",
      deadline: "2024-12-15",
      amount: "$10,000",
      match: "95%"
    },
    {
      id: 2,
      title: "Tech Innovation Grant",
      deadline: "2024-11-30",
      amount: "$7,500",
      match: "88%"
    },
    {
      id: 3,
      title: "Community Service Award",
      deadline: "2024-12-20",
      amount: "$5,000",
      match: "92%"
    }
  ];

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back!</h1>
        <p className="dashboard-subtitle">
          Here's your scholarship journey overview for today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.change} from last week
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Recent Activity */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.status === 'approved' && <FiCheckCircle className="approved" />}
                  {activity.status === 'pending' && <FiCalendar className="pending" />}
                  {activity.status === 'saved' && <FiBookmark className="saved" />}
                </div>
                <div className="activity-details">
                  <p className="activity-text">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-scholarship">{activity.scholarship}</span>
                  </p>
                  <span className="activity-date">{activity.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Scholarships */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Recommended for You</h2>
            <button className="view-all-btn">See More</button>
          </div>
          <div className="scholarship-list">
            {recommendedScholarships.map((scholarship) => (
              <div key={scholarship.id} className="scholarship-item">
                <div className="scholarship-info">
                  <h4 className="scholarship-title">{scholarship.title}</h4>
                  <div className="scholarship-meta">
                    <span className="deadline">
                      <FiCalendar size={14} />
                      Due {scholarship.deadline}
                    </span>
                    <span className="amount">
                      <FiDollarSign size={14} />
                      {scholarship.amount}
                    </span>
                  </div>
                </div>
                <div className="match-badge">
                  {scholarship.match} match
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card quick-actions">
          <h2 className="card-title">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn primary">
              <FiAward size={20} />
              <span>Find Scholarships</span>
            </button>
            <button className="action-btn secondary">
              <FiBookmark size={20} />
              <span>View Bookmarks</span>
            </button>
            <button className="action-btn secondary">
              <FiTrendingUp size={20} />
              <span>Track Applications</span>
            </button>
            <button className="action-btn secondary">
              <FiCheckCircle size={20} />
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {/* Application Progress */}
        <div className="content-card progress-card">
          <h2 className="card-title">Application Progress</h2>
          <div className="progress-stats">
            <div className="progress-item">
              <span className="progress-label">Profile Completion</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="progress-value">85%</span>
            </div>
            <div className="progress-item">
              <span className="progress-label">Applications Ready</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <span className="progress-value">60%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}