# Transit System Predictive Analytics Dashboard

A comprehensive, real-time dashboard for monitoring and analyzing public transportation systems using AI/ML-powered predictive analytics.

## 🚀 Features

- **Real-time Monitoring**: Live device status, transactions, and system health metrics
- **Predictive Analytics**: AI-powered failure prediction and maintenance scheduling  
- **Interactive Dashboards**: Dynamic KPI cards, charts, and device monitoring
- **Multi-City Support**: Boston MBTA and Philadelphia SEPTA configurations
- **Advanced Search**: Smart filtering and device lookup capabilities
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error boundaries and fallback UI

## 🛠 Technology Stack

- **Frontend**: React 18 with Hooks and Context API
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Recharts for interactive data visualizations
- **Icons**: Lucide React for consistent iconography
- **State Management**: useReducer with Context API
- **Deployment**: Vercel with custom domain support

## 📦 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Git for version control
- Vercel account for deployment

### 1. Clone Repository

```bash
git clone https://github.com/pkumv1/transit-analytics-dashboard.git
cd transit-analytics-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 4. Build for Production

```bash
npm run build
```

## 🚀 Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pkumv1/transit-analytics-dashboard)

### Manual Deployment

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import this GitHub repository
   - Configure project settings (auto-detected)
   - Deploy!

2. **Add Custom Domain**:
   - Project Settings → Domains
   - Add: `aiml.egovmars.in`
   - Configure DNS at your domain provider

### DNS Configuration

```bash
# Add CNAME record at your DNS provider:
Type: CNAME
Name: aiml
Value: your-project.vercel.app
TTL: 300
```

## 📊 Dashboard Features

### KPI Monitoring
- Total devices and operational status
- Daily transaction volumes
- System health percentages  
- Active user counts
- Response time metrics

### Device Management
- Real-time device status monitoring
- Predictive failure analysis
- Maintenance scheduling
- Performance metrics tracking

### Interactive Elements
- Advanced search and filtering
- Real-time data updates
- Modal analysis windows
- Toast notifications
- Activity feed

## 🔧 Configuration

### Adding New Transit Systems

Modify `src/App.js` to add new cities:

```javascript
const cityConfig = {
  'new-city': {
    name: 'Transit System Name',
    operator: 'Transit Authority Name',
    system: 'Fare System Version',
    vendor: 'Technology Vendor',
    timezone: 'EST',
    currency: 'USD'
  }
};
```

### Customizing Styling

Update `src/index.css` for custom themes and styling.

## 🔍 Performance

- **Bundle Size**: Optimized for fast loading
- **Real-time Updates**: WebSocket simulation for live data
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Dashboard**: https://aiml.egovmars.in
- **GitHub Repository**: https://github.com/pkumv1/transit-analytics-dashboard
- **Vercel Project**: https://vercel.com/dashboard

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@egovmars.in

---

**Built with ❤️ for better public transportation systems**

## 🌟 Key Highlights

- ⚡ **Lightning Fast**: Optimized React 18 with modern hooks
- 🎨 **Beautiful UI**: Tailwind CSS with custom gradients and animations
- 📱 **Fully Responsive**: Works perfectly on all device sizes
- 🔍 **AI-Powered**: Predictive analytics for proactive maintenance
- 🚇 **Transit-Focused**: Built specifically for public transportation
- 🔄 **Real-time**: Live data updates every 3 seconds
- 🛡️ **Enterprise Ready**: Error boundaries and production configurations

Ready to revolutionize your transit operations with cutting-edge analytics! 🚀