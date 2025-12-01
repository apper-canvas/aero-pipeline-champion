import { useState, useEffect } from 'react';
import { salesOrderService } from '@/services/api/salesOrderService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

function safeDateFormat(dateValue, fallback = "Unknown") {
  if (!dateValue) return fallback;
  try {
    const date = typeof dateValue === 'string' ? parseISO(dateValue) : new Date(dateValue);
    if (isNaN(date.getTime())) return fallback;
    return format(date, 'MMM d, yyyy h:mm a');
  } catch {
    return fallback;
  }
}

export default function SalesOrderDetailModal({ isOpen, onClose, order, onUpdateSuccess }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (order && isOpen) {
      setEditData({
        title_c: order.title_c || '',
        total_amount_c: order.total_amount_c?.toString() || '',
        status_c: order.status_c || 'Draft',
        shipping_address_c: order.shipping_address_c || '',
        billing_address_c: order.billing_address_c || '',
        notes_c: order.notes_c || '',
        Tags: order.Tags || ''
      });
      setIsEditing(false);
    }
  }, [order, isOpen]);

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData({
      title_c: order.title_c || '',
      total_amount_c: order.total_amount_c?.toString() || '',
      status_c: order.status_c || 'Draft',
      shipping_address_c: order.shipping_address_c || '',
      billing_address_c: order.billing_address_c || '',
      notes_c: order.notes_c || '',
      Tags: order.Tags || ''
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!editData.title_c.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!editData.total_amount_c || parseFloat(editData.total_amount_c) < 0) {
      toast.error('Valid total amount is required');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...editData,
        total_amount_c: parseFloat(editData.total_amount_c) || 0
      };

      const result = await salesOrderService.update(order.Id, updateData);
      
      if (result) {
        setIsEditing(false);
        onUpdateSuccess();
      }
    } catch (error) {
      console.error('Error updating sales order:', error);
      toast.error('Failed to update sales order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {order.title_c || order.Name || 'Sales Order Details'}
            </h2>
            <Badge className={getStatusColor(order.status_c)}>
              {order.status_c || 'Draft'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button variant="outline" onClick={handleEdit}>
                <ApperIcon name="Edit" size={16} />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading && <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />}
                  Save
                </Button>
              </div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Title</Label>
              {isEditing ? (
                <Input
                  name="title_c"
                  value={editData.title_c}
                  onChange={handleChange}
                  placeholder="Enter title"
                />
              ) : (
                <p className="text-gray-900 font-medium">{order.title_c || 'N/A'}</p>
              )}
            </div>

            <div>
              <Label>Internal Name</Label>
              <p className="text-gray-900">{order.Name || 'N/A'}</p>
            </div>

            <div>
              <Label>Company</Label>
              <p className="text-gray-900">{order.company_id_c?.Name || 'No Company'}</p>
            </div>

            <div>
              <Label>Related Deal</Label>
              <p className="text-gray-900">{order.deal_id_c?.Name || 'No Deal'}</p>
            </div>

            <div>
              <Label>Order Date</Label>
              <p className="text-gray-900">{safeDateFormat(order.order_date_c, 'Not set')}</p>
            </div>

            <div>
              <Label>Total Amount</Label>
              {isEditing ? (
                <Input
                  name="total_amount_c"
                  type="number"
                  value={editData.total_amount_c}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              ) : (
                <p className="text-gray-900 font-semibold text-lg">{formatCurrency(order.total_amount_c)}</p>
              )}
            </div>

            <div>
              <Label>Status</Label>
              {isEditing ? (
                <select
                  name="status_c"
                  value={editData.status_c}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Draft">Draft</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              ) : (
                <Badge className={getStatusColor(order.status_c)}>
                  {order.status_c || 'Draft'}
                </Badge>
              )}
            </div>

            <div>
              <Label>Tags</Label>
              {isEditing ? (
                <Input
                  name="Tags"
                  value={editData.Tags}
                  onChange={handleChange}
                  placeholder="Comma-separated tags"
                />
              ) : (
                <p className="text-gray-900">{order.Tags || 'No tags'}</p>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Shipping Address</Label>
              {isEditing ? (
                <textarea
                  name="shipping_address_c"
                  value={editData.shipping_address_c}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter shipping address"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {order.shipping_address_c || 'No shipping address provided'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label>Billing Address</Label>
              {isEditing ? (
                <textarea
                  name="billing_address_c"
                  value={editData.billing_address_c}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter billing address"
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {order.billing_address_c || 'No billing address provided'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            {isEditing ? (
              <textarea
                name="notes_c"
                value={editData.notes_c}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {order.notes_c || 'No notes provided'}
                </p>
              </div>
            )}
          </div>

          {/* System Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <Label>Created On</Label>
                <p className="text-gray-900">{safeDateFormat(order.CreatedOn)}</p>
              </div>
              <div>
                <Label>Created By</Label>
                <p className="text-gray-900">{order.CreatedBy?.Name || 'Unknown'}</p>
              </div>
              <div>
                <Label>Modified On</Label>
                <p className="text-gray-900">{safeDateFormat(order.ModifiedOn)}</p>
              </div>
              <div>
                <Label>Modified By</Label>
                <p className="text-gray-900">{order.ModifiedBy?.Name || 'Unknown'}</p>
              </div>
              <div>
                <Label>Owner</Label>
                <p className="text-gray-900">{order.Owner?.Name || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}