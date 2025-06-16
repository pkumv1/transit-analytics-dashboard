import React, { useState, useEffect, useCallback, useMemo, useRef, useReducer, createContext, useContext } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, AreaChart, Area, ComposedChart } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Users, DollarSign, Activity, Shield, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Wrench, Cpu, CreditCard, DoorOpen, Monitor, Settings, Filter, Download, Search, Calendar, Wifi, WifiOff, Zap, Database, BarChart3, Eye, EyeOff, Maximize2, Minimize2, RefreshCw, Bell, BellOff, ChevronDown, ChevronUp, X, Play, Pause, RotateCcw, FileDown, Share2, MessageSquare, Layers, Target, Home, Map, List, Grid, MoreVertical, ChevronRight, Bookmark, Star } from 'lucide-react';

// ===== CONTEXT AND STATE MANAGEMENT =====
const DashboardContext = createContext();

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SELECTED_CITY':
      return { ...state, selectedCity: action.payload };
    case 'SET_TIMEFRAME':
      return { ...state, selectedTimeframe: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_CONNECTION':
      return { ...state, isConnected: action.payload };
    case 'SET_REALTIME_DATA':
      return { ...state, realtimeData: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications.slice(0, 4)] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'TOGGLE_FILTERS':
      return { ...state, filtersOpen: !state.filtersOpen };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    default:
      return state;
  }
};

const initialState = {
  selectedCity: 'boston',
  selectedTimeframe: '24h',
  activeTab: 'overview',
  isConnected: true,
  loading: false,
  viewMode: 'grid',
  filters: {},
  notifications: [],
  filtersOpen: false,
  searchTerm: '',
  soundEnabled: true,
  realtimeData: {
    totalDevices: 1247,
    operationalDevices: 1174,
    dailyTransactions: 485320,
    systemHealth: 94.2,
    maintenanceAlerts: 12,
    avgResponseTime: 1.2,
    networkLatency: 45,
    revenue: 1256000,
    activeUsers: 78500
  }
};

// ===== CUSTOM HOOKS =====
const useRealtimeData = (selectedCity, isConnected) => {
  const [realtimeData, setRealtimeData] = useState(() => ({
    totalDevices: selectedCity === 'boston' ? 1247 : 892,
    operationalDevices: selectedCity === 'boston' ? 1174 : 845,
    dailyTransactions: selectedCity === 'boston' ? 485320 : 312450,
    systemHealth: selectedCity === 'boston' ? 94.2 : 92.8,
    maintenanceAlerts: selectedCity === 'boston' ? 12 : 8,
    avgResponseTime: selectedCity === 'boston' ? 1.2 : 1.4,
    networkLatency: selectedCity === 'boston' ? 45 : 52,
    revenue: selectedCity === 'boston' ? 1256000 : 847000,
    activeUsers: selectedCity === 'boston' ? 78500 : 52300
  }));

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        dailyTransactions: prev.dailyTransactions + Math.floor(Math.random() * 100),
        operationalDevices: Math.max(prev.totalDevices - 30, prev.totalDevices - Math.floor(Math.random() * 15)),
        systemHealth: Math.max(85, Math.min(99, prev.systemHealth + (Math.random() - 0.5) * 1)),
        avgResponseTime: Math.max(0.8, Math.min(3.0, prev.avgResponseTime + (Math.random() - 0.5) * 0.2)),
        networkLatency: Math.max(20, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 5)),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 1000))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return realtimeData;
};

const useActivities = (isConnected) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!isConnected) return;

    const activityTypes = [
      'Device FVM-001 completed transaction',
      'Maintenance scheduled for GTE-234',
      'New user registered',
      'Payment processor updated',
      'Network connectivity restored',
      'Fare adjustment processed'
    ];

    const interval = setInterval(() => {
      setActivities(prev => [
        {
          id: Date.now(),
          message: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          time: new Date().toLocaleTimeString(),
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)],
          device: `${['FVM', 'RDR', 'GTE'][Math.floor(Math.random() * 3)]}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
        },
        ...prev.slice(0, 20)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return activities;
};

const useNotifications = (soundEnabled) => {
  const addNotification = useCallback((message, type = 'info', action = null) => {
    try {
      const id = Date.now();
      const notification = { id, message, type, action };
      
      if (soundEnabled && type === 'error') {
        // Could play sound here in a real app
      }
      
      return notification;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }, [soundEnabled]);

  return { addNotification };
};

// ===== ERROR BOUNDARY =====
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg border border-red-200">
            <div className="flex items-center text-red-600 mb-6">
              <AlertTriangle size={32} className="mr-3" />
              <h2 className="text-2xl font-bold">System Error</h2>
            </div>
            <p className="text-gray-700 mb-6">
              The dashboard encountered an unexpected error. Our team has been notified.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Refresh Dashboard
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })} 
                className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===== UTILITY COMPONENTS =====
const LoadingSpinner = ({ size = 24, className = "", text = "" }) => (
  <div className={`flex items-center justify-center ${className}`} role="status" aria-label={text || "Loading"}>
    <div className="relative">
      <div 
        className="animate-spin rounded-full border-3 border-blue-600 border-t-transparent"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 animate-ping rounded-full border border-blue-300 opacity-30"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    </div>
    {text && <span className="ml-3 text-sm font-medium text-gray-600">{text}</span>}
  </div>
);

const StatusIndicator = ({ status, showText = false, size = "sm" }) => {
  const configs = {
    good: { color: 'bg-green-500', text: 'Operational', icon: '✓' },
    warning: { color: 'bg-yellow-500', text: 'Warning', icon: '⚠' },
    critical: { color: 'bg-red-500', text: 'Critical', icon: '✗' },
    unknown: { color: 'bg-gray-500', text: 'Unknown', icon: '?' }
  };

  const config = configs[status] || configs.unknown;
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className="flex items-center">
      <div 
        className={`${sizeClass} rounded-full ${config.color}`} 
        title={config.text}
        aria-label={`Status: ${config.text}`}
      />
      <span className="sr-only">{config.text}</span>
      {showText && <span className="ml-2 text-sm">{config.text}</span>}
    </div>
  );
};

// ===== TOAST SYSTEM =====
const Toast = ({ message, type = 'info', onClose, duration = 4000, action }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timeoutRef.current);
  }, [onClose, duration]);

  const handleMouseEnter = useCallback(() => clearTimeout(timeoutRef.current), []);
  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 1000);
  }, [onClose]);

  const typeConfig = {
    info: { bg: 'bg-blue-600', border: 'border-blue-700', icon: '💡' },
    success: { bg: 'bg-green-600', border: 'border-green-700', icon: '✅' },
    warning: { bg: 'bg-yellow-600', border: 'border-yellow-700', icon: '⚠️' },
    error: { bg: 'bg-red-600', border: 'border-red-700', icon: '❌' }
  };

  const config = typeConfig[type];

  return (
    <div 
      className={`fixed top-4 right-4 ${config.bg} text-white px-6 py-4 rounded-xl shadow-2xl z-50 
        transform transition-all duration-300 border-l-4 ${config.border} max-w-sm min-w-80
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <span className="text-lg mr-3" aria-hidden="true">{config.icon}</span>
          <div>
            <span className="text-sm font-medium">{message}</span>
            {action && (
              <button 
                onClick={action.handler}
                className="block text-xs underline hover:no-underline mt-1 opacity-90"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// ===== SEARCH COMPONENT =====
const AdvancedSearch = ({ onSearch, placeholder = "Search devices, alerts, or metrics..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    onSearch(value);
  }, [onSearch]);

  const handleFocus = useCallback(() => setIsOpen(true), []);
  const handleBlur = useCallback(() => setTimeout(() => setIsOpen(false), 200), []);
  const clearSearch = useCallback(() => handleSearch(''), [handleSearch]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={20} className="absolute left-3 top-3 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          aria-label="Search dashboard"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {isOpen && searchTerm && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3">
            <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm">
                Search for device "{searchTerm}"
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm">
                Filter alerts containing "{searchTerm}"
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== KPI CARD COMPONENT =====
const EnhancedKPICard = ({ title, value, change, icon: Icon, color, subtitle, loading = false, trend = [], onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
    onClick && onClick();
  }, [isExpanded, onClick]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
        <LoadingSpinner size={20} text="Updating..." className="mt-2" />
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-xl p-6 border-l-4 transition-all duration-300 cursor-pointer
        transform hover:-translate-y-1 hover:scale-105 group ${isExpanded ? 'ring-2 ring-blue-200' : ''}`}
      style={{ borderLeftColor: color }}
      onClick={toggleExpanded}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && toggleExpanded()}
      aria-expanded={isExpanded}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              aria-hidden="true"
            />
          </div>
          
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {value}
            </p>
            {change !== undefined && (
              <div className={`flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span className="text-sm font-medium ml-1">{Math.abs(change)}%</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex flex-col items-center">
          <div 
            className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={28} style={{ color }} aria-hidden="true" />
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" title="Live data" />
        </div>
      </div>

      {isExpanded && trend.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== DEVICE STATUS CARD =====
const DeviceStatusCard = ({ deviceType, data, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-gray-200">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <Icon size={20} className="mr-2 text-blue-600" aria-hidden="true" />
        <span className="font-semibold">{deviceType}</span>
      </div>
      <span className="text-sm text-gray-500">{data.total} Total</span>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
        <div className="text-lg font-bold text-green-600">{data.operational}</div>
        <div className="text-xs text-green-600">Operational</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 border border-yellow-200">
        <div className="text-lg font-bold text-yellow-600">{data.warning}</div>
        <div className="text-xs text-yellow-600">Warning</div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
        <div className="text-lg font-bold text-red-600">{data.critical}</div>
        <div className="text-xs text-red-600">Critical</div>
      </div>
    </div>
  </div>
);

// ===== ACTIVITY FEED =====
const ActivityFeed = ({ activities = [] }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold flex items-center">
        <Activity size={20} className="mr-2 text-blue-600" aria-hidden="true" />
        Live Activity Feed
      </h3>
      <div className="flex items-center text-sm text-gray-500">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" aria-hidden="true" />
        Real-time
      </div>
    </div>
    
    <div className="space-y-3 max-h-80 overflow-y-auto" role="log" aria-label="Activity feed">
      {activities.slice(0, 8).map((activity, index) => (
        <div key={activity.id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <StatusIndicator status={activity.type} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{activity.message}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          {activity.device && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {activity.device}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ===== DEVICE ANALYSIS MODAL =====
const DeviceAnalysisModal = ({ device, isOpen, onClose, analysisType = 'analysis' }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && device) {
      setLoading(true);
      setAnalysisData(null);
      
      const timer = setTimeout(() => {
        try {
          setAnalysisData({
            deviceId: device?.device || device || 'Unknown Device',
            healthScore: device?.health || 75,
            predictedFailure: device?.predictedFailure || 8,
            confidence: device?.confidence || 85,
            analysisType,
            timestamp: new Date().toLocaleString(),
            detailedMetrics: {
              vibrationLevel: Math.random() * 10,
              temperature: 35 + Math.random() * 15,
              powerConsumption: 85 + Math.random() * 30,
              errorRate: Math.random() * 5,
              utilizationRate: 60 + Math.random() * 40,
              networkLatency: 20 + Math.random() * 50
            }
          });
          setLoading(false);
        } catch (error) {
          console.error('Failed to generate analysis data:', error);
          setLoading(false);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, device, analysisType]);

  useEffect(() => {
    if (!isOpen) {
      setAnalysisData(null);
      setLoading(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const deviceName = device?.device || device || 'Unknown Device';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      style={{ zIndex: 10000 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="modal-title" className="text-2xl font-bold text-gray-900 flex items-center">
                <Cpu size={24} className="mr-3 text-blue-600" aria-hidden="true" />
                {analysisType} - {deviceName}
              </h3>
              <p className="text-gray-600 mt-1">Comprehensive AI-powered device analysis</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <LoadingSpinner size={48} text="Running AI Analysis..." />
                <p className="text-gray-600 mt-4">Analyzing device health, performance metrics, and failure predictions</p>
                <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          ) : analysisData ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">📊 Analysis Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      analysisData.healthScore >= 80 ? 'text-green-600' :
                      analysisData.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysisData.healthScore}%
                    </div>
                    <div className="text-sm text-gray-600">Health Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analysisData.predictedFailure}</div>
                    <div className="text-sm text-gray-600">Days to Failure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisData.confidence}%</div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">$1,200</div>
                    <div className="text-sm text-gray-600">Est. Maint. Cost</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity size={20} className="mr-2 text-green-500" aria-hidden="true" />
                  Real-time Performance Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(analysisData.detailedMetrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {typeof value === 'number' ? value.toFixed(1) : value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Failed to load analysis data. Please try again.</p>
              <button 
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Analysis
              </button>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {analysisData ? `Analysis completed at ${analysisData.timestamp}` : 'Analysis in progress...'}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => alert('Maintenance scheduled successfully!')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                Schedule Maintenance
              </button>
              <button 
                onClick={onClose}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN DASHBOARD PROVIDER =====
const DashboardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const realtimeData = useRealtimeData(state.selectedCity, state.isConnected);
  const activities = useActivities(state.isConnected);
  const { addNotification } = useNotifications(state.soundEnabled);

  const contextValue = useMemo(() => ({
    state: { ...state, realtimeData },
    dispatch,
    activities,
    addNotification
  }), [state, realtimeData, activities, addNotification]);

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// ===== MAIN DASHBOARD COMPONENT =====
const EnhancedTransitAFCDashboard = () => {
  const { state, dispatch, activities, addNotification } = useDashboard();
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [analysisType, setAnalysisType] = useState('');

  // City configurations
  const cityConfig = {
    boston: {
      name: 'MBTA (Boston)',
      operator: 'Massachusetts Bay Transportation Authority',
      system: 'AFC 2.0',
      vendor: 'Cubic Transportation Systems',
      timezone: 'EST',
      currency: 'USD'
    },
    philadelphia: {
      name: 'SEPTA (Philadelphia)',
      operator: 'Southeastern Pennsylvania Transportation Authority', 
      system: 'SEPTA Key 2.0',
      vendor: 'Cubic Transportation Systems',
      timezone: 'EST',
      currency: 'USD'
    }
  };

  const deviceInventory = {
    boston: {
      readers: { total: 450, operational: 425, critical: 8, warning: 17 },
      fvms: { total: 298, operational: 285, critical: 3, warning: 10 },
      gates: { total: 499, operational: 464, critical: 1, warning: 34 }
    },
    philadelphia: {
      readers: { total: 320, operational: 305, critical: 5, warning: 10 },
      fvms: { total: 185, operational: 178, critical: 2, warning: 5 },
      gates: { total: 387, operational: 362, critical: 3, warning: 22 }
    }
  };

  const deviceData = useMemo(() => {
    const baseData = {
      boston: [
        { device: 'FVM-001', type: 'FVM', predictedFailure: 3, confidence: 89, health: 65, status: 'critical', location: 'Downtown', usage: 'High' },
        { device: 'FVM-043', type: 'FVM', predictedFailure: 7, confidence: 76, health: 78, status: 'warning', location: 'Airport', usage: 'Medium' },
        { device: 'RDR-156', type: 'Reader', predictedFailure: 5, confidence: 82, health: 71, status: 'critical', location: 'Suburban', usage: 'Low' },
        { device: 'GTE-289', type: 'Gate', predictedFailure: 12, confidence: 91, health: 85, status: 'good', location: 'Downtown', usage: 'High' },
        { device: 'FVM-089', type: 'FVM', predictedFailure: 15, confidence: 68, health: 88, status: 'good', location: 'Airport', usage: 'Medium' },
        { device: 'RDR-234', type: 'Reader', predictedFailure: 4, confidence: 94, health: 62, status: 'critical', location: 'Downtown', usage: 'High' }
      ],
      philadelphia: [
        { device: 'FVM-201', type: 'FVM', predictedFailure: 6, confidence: 85, health: 72, status: 'warning', location: 'Downtown', usage: 'Medium' },
        { device: 'RDR-301', type: 'Reader', predictedFailure: 2, confidence: 92, health: 58, status: 'critical', location: 'Airport', usage: 'High' },
        { device: 'GTE-445', type: 'Gate', predictedFailure: 9, confidence: 78, health: 81, status: 'good', location: 'Suburban', usage: 'Low' },
        { device: 'FVM-187', type: 'FVM', predictedFailure: 11, confidence: 73, health: 86, status: 'good', location: 'Downtown', usage: 'Medium' }
      ]
    };

    let filteredData = baseData[state.selectedCity] || [];
    
    if (state.filters.deviceType && state.filters.deviceType !== 'all') {
      filteredData = filteredData.filter(d => d.type.toLowerCase().includes(state.filters.deviceType));
    }
    
    if (state.searchTerm) {
      filteredData = filteredData.filter(d => 
        d.device.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        d.type.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(state.searchTerm.toLowerCase())
      );
    }

    return filteredData;
  }, [state.selectedCity, state.filters, state.searchTerm]);

  const generateTrendData = useCallback((baseValue, points = 24) => {
    return Array.from({ length: points }, (_, i) => ({
      time: i,
      value: baseValue + (Math.random() - 0.5) * baseValue * 0.2
    }));
  }, []);

  const kpiData = useMemo(() => [
    {
      title: "Total Devices",
      value: state.realtimeData.totalDevices.toLocaleString(),
      icon: Monitor,
      color: "#3B82F6",
      subtitle: `${cityConfig[state.selectedCity].system}`,
      trend: generateTrendData(state.realtimeData.totalDevices, 12)
    },
    {
      title: "Operational",
      value: state.realtimeData.operationalDevices.toLocaleString(),
      change: 0.2,
      icon: CheckCircle,
      color: "#10B981",
      subtitle: `${((state.realtimeData.operationalDevices/state.realtimeData.totalDevices)*100).toFixed(1)}% uptime`,
      trend: generateTrendData(state.realtimeData.operationalDevices, 12)
    },
    {
      title: "Daily Transactions",
      value: state.realtimeData.dailyTransactions.toLocaleString(),
      change: 2.3,
      icon: Activity,
      color: "#F59E0B",
      trend: generateTrendData(state.realtimeData.dailyTransactions, 12)
    },
    {
      title: "System Health",
      value: `${state.realtimeData.systemHealth.toFixed(1)}%`,
      change: 0.5,
      icon: Shield,
      color: "#8B5CF6",
      trend: generateTrendData(state.realtimeData.systemHealth, 12)
    },
    {
      title: "Active Users",
      value: state.realtimeData.activeUsers.toLocaleString(),
      change: 1.8,
      icon: Users,
      color: "#06B6D4",
      trend: generateTrendData(state.realtimeData.activeUsers, 12)
    },
    {
      title: "Avg Response",
      value: `${state.realtimeData.avgResponseTime.toFixed(1)}s`,
      change: -5.2,
      icon: Zap,
      color: "#84CC16",
      subtitle: "Transaction time",
      trend: generateTrendData(state.realtimeData.avgResponseTime, 12)
    }
  ], [state.realtimeData, state.selectedCity, generateTrendData]);

  const handleDeviceAnalysis = useCallback((deviceId, analysisTypeParam = 'analysis') => {
    try {
      const device = deviceData.find(d => d.device === deviceId) || 
                     { device: deviceId, type: 'Unknown', health: 75, predictedFailure: 8, confidence: 85, status: 'unknown' };
      
      setSelectedDevice(device);
      setAnalysisType(analysisTypeParam);
      
      const notification = addNotification(`🔍 Opening ${analysisTypeParam} for ${deviceId}...`, 'info');
      if (notification) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      }
    } catch (error) {
      console.error('Failed to open device analysis:', error);
      const notification = addNotification('Failed to open device analysis', 'error');
      if (notification) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      }
    }
  }, [deviceData, addNotification, dispatch]);

  const closeAnalysisModal = useCallback(() => {
    setSelectedDevice(null);
    setAnalysisType('');
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: searchTerm });
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    try {
      const notification = addNotification('✨ Dashboard refreshed successfully', 'success');
      if (notification) {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      }
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  }, [addNotification, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 bg-gradient-to-r from-white via-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
                  <Shield size={36} className="text-blue-600" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Live data" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Transit System Predictive Analytics
                </h1>
                <p className="text-gray-600 mt-1">
                  {cityConfig[state.selectedCity].operator} - Next-Generation AI/ML Operations Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <AdvancedSearch onSearch={handleSearch} />
            
            <button
              onClick={() => dispatch({ type: 'TOGGLE_FILTERS' })}
              className={`p-3 rounded-lg transition-colors ${
                state.filtersOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label="Toggle filters"
            >
              <Filter size={20} />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => dispatch({ type: 'SET_CONNECTION', payload: !state.isConnected })}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.isConnected 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {state.isConnected ? <Wifi size={16} className="mr-2" /> : <WifiOff size={16} className="mr-2" />}
                {state.isConnected ? 'Live' : 'Offline'}
              </button>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
                className={`p-2 rounded-lg transition-colors ${
                  state.soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}
                aria-label={`${state.soundEnabled ? 'Disable' : 'Enable'} sound notifications`}
              >
                {state.soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </button>
            </div>

            <select 
              value={state.selectedCity} 
              onChange={(e) => dispatch({ type: 'SET_SELECTED_CITY', payload: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-40"
            >
              <option value="boston">🚇 MBTA (Boston)</option>
              <option value="philadelphia">🚊 SEPTA (Philadelphia)</option>
            </select>

            <button
              onClick={handleRefresh}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
              disabled={state.loading}
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={20} className={state.loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 mb-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiData.map((kpi, index) => (
          <EnhancedKPICard 
            key={index}
            {...kpi}
            loading={state.loading}
            onClick={() => {
              const notification = addNotification(`📊 ${kpi.title} details opened`, 'info');
              if (notification) {
                dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
              }
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="space-y-6">
                {/* Device Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <DeviceStatusCard 
                    deviceType="Card Readers" 
                    data={deviceInventory[state.selectedCity].readers}
                    icon={CreditCard}
                  />
                  <DeviceStatusCard 
                    deviceType="Fare Vending Machines" 
                    data={deviceInventory[state.selectedCity].fvms}
                    icon={Monitor}
                  />
                  <DeviceStatusCard 
                    deviceType="Fare Gates" 
                    data={deviceInventory[state.selectedCity].gates}
                    icon={DoorOpen}
                  />
                </div>

                {/* Device Table */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Critical Device Monitoring</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{deviceData.length} devices shown</span>
                        <button
                          onClick={() => handleDeviceAnalysis('BULK-ANALYSIS', 'Bulk Analysis of All Devices')}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex items-center"
                        >
                          <BarChart3 size={16} className="mr-2" />
                          Analyze All
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {deviceData.map((device, index) => (
                          <tr key={device.device || index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <StatusIndicator status={device.status} />
                                <span className="ml-3 font-medium text-gray-900">{device.device}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {device.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {device.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      device.health >= 80 ? 'bg-green-500' :
                                      device.health >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${device.health}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{device.health}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className={`font-bold ${
                                  device.predictedFailure <= 5 ? 'text-red-600' :
                                  device.predictedFailure <= 10 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {device.predictedFailure} days
                                </div>
                                <div className="text-xs text-gray-500">{device.confidence}% confidence</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button 
                                onClick={() => handleDeviceAnalysis(device.device, 'Deep Analysis')}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Cpu size={12} className="mr-1" />
                                Analyze
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 bg-gradient-to-r from-white via-gray-50 to-blue-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-blue-500" aria-hidden="true" />
              <span className="font-medium">{cityConfig[state.selectedCity].name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database size={16} className="text-purple-500" aria-hidden="true" />
              <span>{cityConfig[state.selectedCity].vendor}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-green-500" aria-hidden="true" />
              <span>Updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" aria-hidden="true" />
              <span>PPP Contract Active</span>
            </div>
            <div className="flex items-center space-x-2">
              {state.isConnected ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-red-500" />}
              <span>{state.isConnected ? 'Real-time Connected' : 'Offline Mode'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Analysis Modal */}
      <DeviceAnalysisModal
        device={selectedDevice}
        isOpen={!!selectedDevice}
        onClose={closeAnalysisModal}
        analysisType={analysisType}
      />

      {/* Toast Notifications */}
      {state.notifications.map(notification => (
        <Toast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          action={notification.action}
          onClose={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
        />
      ))}
    </div>
  );
};

// ===== MAIN APP =====
const App = () => {
  return (
    <ErrorBoundary>
      <DashboardProvider>
        <EnhancedTransitAFCDashboard />
      </DashboardProvider>
    </ErrorBoundary>
  );
};

export default App;