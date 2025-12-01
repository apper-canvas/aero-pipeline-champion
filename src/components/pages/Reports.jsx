import React, { useState, useEffect } from 'react';
import { dealService } from '@/services/api/dealService';
import { leadService } from '@/services/api/leadService';
import { companyService } from '@/services/api/companyService';
import { contactService } from '@/services/api/contactService';
import { taskService } from '@/services/api/taskService';
import { quoteService } from '@/services/api/quoteService';
import { salesOrderService } from '@/services/api/salesOrderService';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Chart from 'react-apexcharts';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [viewType, setViewType] = useState('overview');
  
  // Data states
  const [metrics, setMetrics] = useState({
    totalDeals: 0,
    totalRevenue: 0,
    totalLeads: 0,
    totalTasks: 0,
    conversionRate: 0,
    avgDealValue: 0
  });
  
  const [chartData, setChartData] = useState({
    dealsPipeline: { categories: [], series: [] },
    revenueTrend: { categories: [], series: [] },
    leadSources: { categories: [], series: [] }
  });
  
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  useEffect(() => {
    filterAndSortData();
  }, [tableData, searchQuery, sortConfig]);

  const loadReportsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = dateRange === 'month' 
        ? startOfMonth(endDate)
        : subDays(endDate, parseInt(dateRange));

      // Fetch all data concurrently
      const [deals, leads, companies, contacts, tasks, quotes, salesOrders] = await Promise.all([
        dealService.getAll?.() || Promise.resolve([]),
        leadService.getAll?.() || Promise.resolve([]),
        companyService.getAll?.() || Promise.resolve([]),
        contactService.getAll?.() || Promise.resolve([]),
        taskService.getAll?.() || Promise.resolve([]),
        quoteService.getAll?.() || Promise.resolve([]),
        salesOrderService.getAll?.() || Promise.resolve([])
      ]);

      // Filter data by date range
      const filteredDeals = filterByDateRange(deals || [], startDate, endDate, 'created_date_c');
      const filteredLeads = filterByDateRange(leads || [], startDate, endDate, 'created_date_c');
      const filteredTasks = filterByDateRange(tasks || [], startDate, endDate, 'created_date_c');

      // Calculate metrics
      const totalRevenue = filteredDeals.reduce((sum, deal) => {
        const amount = parseFloat(deal.amount_c || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      const wonDeals = filteredDeals.filter(deal => 
        deal.stage_c?.Name?.toLowerCase().includes('won') || 
        deal.stage_c?.Name?.toLowerCase().includes('closed')
      );
      
      const conversionRate = filteredLeads.length > 0 
        ? (wonDeals.length / filteredLeads.length) * 100 
        : 0;
      
      const avgDealValue = filteredDeals.length > 0 ? totalRevenue / filteredDeals.length : 0;

      setMetrics({
        totalDeals: filteredDeals.length,
        totalRevenue,
        totalLeads: filteredLeads.length,
        totalTasks: filteredTasks.length,
        conversionRate,
        avgDealValue
      });

      // Prepare chart data
      preparePipelineChart(deals || []);
      prepareRevenueTrendChart(filteredDeals, startDate, endDate);
      prepareLeadSourcesChart(leads || []);
      
      // Prepare table data
      prepareTableData(filteredDeals, filteredLeads, companies || [], contacts || []);

    } catch (err) {
      console.error('Error loading reports data:', err);
      setError('Failed to load reports data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterByDateRange = (data, startDate, endDate, dateField) => {
    return data.filter(item => {
      if (!item[dateField]) return false;
      try {
        const itemDate = typeof item[dateField] === 'string' 
          ? parseISO(item[dateField]) 
          : new Date(item[dateField]);
        return itemDate >= startDate && itemDate <= endDate;
      } catch {
        return false;
      }
    });
  };

  const preparePipelineChart = (deals) => {
    const stageData = {};
    deals.forEach(deal => {
      const stage = deal.stage_c?.Name || 'Unknown';
      stageData[stage] = (stageData[stage] || 0) + 1;
    });

    setChartData(prev => ({
      ...prev,
      dealsPipeline: {
        categories: Object.keys(stageData),
        series: [{
          name: 'Deals',
          data: Object.values(stageData)
        }]
      }
    }));
  };

  const prepareRevenueTrendChart = (deals, startDate, endDate) => {
    const dailyRevenue = {};
    const currentDate = new Date(startDate);
    
    // Initialize all dates with 0
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      dailyRevenue[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Aggregate revenue by date
    deals.forEach(deal => {
      if (deal.created_date_c) {
        try {
          const dealDate = format(parseISO(deal.created_date_c), 'yyyy-MM-dd');
          if (dailyRevenue.hasOwnProperty(dealDate)) {
            const amount = parseFloat(deal.amount_c || 0);
            dailyRevenue[dealDate] += isNaN(amount) ? 0 : amount;
          }
        } catch (err) {
          // Skip invalid dates
        }
      }
    });

    const sortedDates = Object.keys(dailyRevenue).sort();
    
    setChartData(prev => ({
      ...prev,
      revenueTrend: {
        categories: sortedDates.map(date => format(new Date(date), 'MMM dd')),
        series: [{
          name: 'Revenue',
          data: sortedDates.map(date => dailyRevenue[date])
        }]
      }
    }));
  };

  const prepareLeadSourcesChart = (leads) => {
    const sourceData = {};
    leads.forEach(lead => {
      const source = lead.source_c || 'Unknown';
      sourceData[source] = (sourceData[source] || 0) + 1;
    });

    setChartData(prev => ({
      ...prev,
      leadSources: {
        categories: Object.keys(sourceData),
        series: Object.values(sourceData)
      }
    }));
  };

  const prepareTableData = (deals, leads, companies, contacts) => {
    const combinedData = [
      ...deals.map(item => ({
        ...item,
        type: 'Deal',
        name: item.name_c || 'Unnamed Deal',
        value: parseFloat(item.amount_c || 0),
        status: item.stage_c?.Name || 'Unknown',
        date: item.created_date_c
      })),
      ...leads.map(item => ({
        ...item,
        type: 'Lead',
        name: `${item.first_name_c || ''} ${item.last_name_c || ''}`.trim(),
        value: 0,
        status: item.status_c || 'Unknown',
        date: item.created_date_c
      }))
    ];

    setTableData(combinedData);
  };

  const filterAndSortData = () => {
    let filtered = [...tableData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue?.toLowerCase() || '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Deal': return 'bg-blue-100 text-blue-800';
      case 'Lead': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadReportsData} />;

  const SortIcon = ({ field }) => {
    if (sortConfig.key !== field) return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-blue-600" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
          </Select>
          
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full sm:w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="month">This month</option>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deals</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalDeals}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalLeads}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ApperIcon name="Users" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalTasks}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(metrics.conversionRate)}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <ApperIcon name="Target" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.avgDealValue)}</p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pipeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h3>
          {chartData.dealsPipeline.categories.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'bar', toolbar: { show: false } },
                colors: ['#3b82f6'],
                xaxis: { categories: chartData.dealsPipeline.categories },
                yaxis: { title: { text: 'Number of Deals' } },
                plotOptions: { bar: { horizontal: false, columnWidth: '50%' } }
              }}
              series={chartData.dealsPipeline.series}
              type="bar"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No pipeline data available
            </div>
          )}
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          {chartData.revenueTrend.categories.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'line', toolbar: { show: false } },
                colors: ['#10b981'],
                xaxis: { categories: chartData.revenueTrend.categories },
                yaxis: { title: { text: 'Revenue ($)' } },
                stroke: { curve: 'smooth', width: 3 }
              }}
              series={chartData.revenueTrend.series}
              type="line"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Lead Sources */}
        <div className="bg-white p-6 rounded-lg shadow-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          {chartData.leadSources.categories.length > 0 ? (
            <Chart
              options={{
                chart: { type: 'pie' },
                labels: chartData.leadSources.categories,
                colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                legend: { position: 'bottom' }
              }}
              series={chartData.leadSources.series}
              type="pie"
              height={300}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No lead source data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table */}
      {viewType === 'detailed' && (
        <div className="bg-white rounded-lg shadow-card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Records</h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('type')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Type
                      <SortIcon field="type" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('value')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Value
                      <SortIcon field="value" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Date
                      <SortIcon field="date" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((record, index) => (
                    <tr key={`${record.type}-${record.Id || index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.name || 'Unnamed'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className={getTypeColor(record.type)}>
                          {record.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.value > 0 ? formatCurrency(record.value) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date ? format(parseISO(record.date), 'MMM dd, yyyy') : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;