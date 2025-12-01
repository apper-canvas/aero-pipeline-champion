import React, { useState, useEffect } from 'react';
import { salesOrderService } from '@/services/api/salesOrderService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import AddSalesOrderModal from '@/components/organisms/AddSalesOrderModal';
import SalesOrderDetailModal from '@/components/organisms/SalesOrderDetailModal';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

export default function SalesOrders() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('ModifiedOn');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    setLoading(true);
    try {
      const orders = await salesOrderService.getAll();
      setSalesOrders(orders || []);
      setError(null);
    } catch (err) {
      console.error("Error loading sales orders:", err);
      setError(err.message || 'Failed to load sales orders');
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    loadSalesOrders();
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    setIsDetailModalOpen(false);
    loadSalesOrders();
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this sales order?')) return;
    
    const success = await salesOrderService.delete(orderId);
    if (success) {
      loadSalesOrders();
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const safeDateFormat = (dateValue, fallback = "Unknown") => {
    if (!dateValue) return fallback;
    try {
      const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
      if (isNaN(date.getTime())) return fallback;
      return format(date, 'MMM d, yyyy');
    } catch {
      return fallback;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAndSortedOrders = salesOrders
    .filter(order => {
      const matchesSearch = searchTerm === '' || 
        (order.title_c && order.title_c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.Name && order.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.company_id_c?.Name && order.company_id_c.Name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === '' || order.status_c === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'company_id_c') {
        aVal = a.company_id_c?.Name || '';
        bVal = b.company_id_c?.Name || '';
      }
      
      if (typeof aVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortDirection === 'desc' ? -comparison : comparison;
      }
      
      if (aVal < bVal) return sortDirection === 'desc' ? 1 : -1;
      if (aVal > bVal) return sortDirection === 'desc' ? -1 : 1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" size={16} className="text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ApperIcon name="ArrowUp" size={16} className="text-blue-500" /> : 
      <ApperIcon name="ArrowDown" size={16} className="text-blue-500" />;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadSalesOrders} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Manage your sales orders and track fulfillment</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={20} />
          New Sales Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1">
          <Input
            placeholder="Search by title, name, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredAndSortedOrders.length === 0 ? (
        <Empty 
          title="No sales orders found"
          description={salesOrders.length === 0 ? "Get started by creating your first sales order." : "Try adjusting your search or filter criteria."}
          action={
            salesOrders.length === 0 ? (
              <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                <ApperIcon name="Plus" size={20} />
                Create Sales Order
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('title_c')}
                  >
                    <div className="flex items-center gap-1">
                      Title
                      <SortIcon field="title_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('company_id_c')}
                  >
                    <div className="flex items-center gap-1">
                      Company
                      <SortIcon field="company_id_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('total_amount_c')}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      <SortIcon field="total_amount_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status_c')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon field="status_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('order_date_c')}
                  >
                    <div className="flex items-center gap-1">
                      Order Date
                      <SortIcon field="order_date_c" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedOrders.map((order) => (
                  <tr key={order.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.title_c || order.Name || 'Untitled Order'}
                        </div>
                        {order.Name && order.title_c && order.Name !== order.title_c && (
                          <div className="text-sm text-gray-500">{order.Name}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.company_id_c?.Name || 'No Company'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total_amount_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(order.status_c)}>
                        {order.status_c || 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {safeDateFormat(order.order_date_c)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(order)}
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddSalesOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <SalesOrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}