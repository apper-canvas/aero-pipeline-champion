import { useState, useEffect } from 'react';
import { salesOrderService } from '@/services/api/salesOrderService';
import { companyService } from '@/services/api/companyService';
import { dealService } from '@/services/api/dealService';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

export default function AddSalesOrderModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    Name: '',
    title_c: '',
    company_id_c: '',
    deal_id_c: '',
    order_date_c: '',
    total_amount_c: '',
    status_c: 'Draft',
    shipping_address_c: '',
    billing_address_c: '',
    notes_c: '',
    Tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCompanies();
      loadDeals();
      // Reset form
      setFormData({
        Name: '',
        title_c: '',
        company_id_c: '',
        deal_id_c: '',
        order_date_c: new Date().toISOString().split('T')[0],
        total_amount_c: '',
        status_c: 'Draft',
        shipping_address_c: '',
        billing_address_c: '',
        notes_c: '',
        Tags: ''
      });
    }
  }, [isOpen]);

  const loadCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const companiesData = await companyService.getAll();
      setCompanies(companiesData || []);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const loadDeals = async () => {
    setLoadingDeals(true);
    try {
      const dealsData = await dealService.getAll();
      setDeals(dealsData || []);
    } catch (error) {
      console.error('Error loading deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoadingDeals(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title_c.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.total_amount_c || parseFloat(formData.total_amount_c) < 0) {
      toast.error('Valid total amount is required');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        Name: formData.Name || formData.title_c,
        total_amount_c: parseFloat(formData.total_amount_c) || 0,
        company_id_c: formData.company_id_c ? parseInt(formData.company_id_c) : null,
        deal_id_c: formData.deal_id_c ? parseInt(formData.deal_id_c) : null,
        order_date_c: formData.order_date_c || new Date().toISOString().split('T')[0]
      };

      const result = await salesOrderService.create(orderData);
      
      if (result) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating sales order:', error);
      toast.error('Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Sales Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Title *"
              type="text"
              name="title_c"
              value={formData.title_c}
              onChange={handleChange}
              placeholder="Enter sales order title"
              required
            />

            <FormField
              label="Internal Name"
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              placeholder="Internal reference name"
            />

            <div>
              <Label htmlFor="company_id_c">Company</Label>
              <select
                id="company_id_c"
                name="company_id_c"
                value={formData.company_id_c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingCompanies}
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.Id} value={company.Id}>
                    {company.Name || company.company_name_c}
                  </option>
                ))}
              </select>
              {loadingCompanies && (
                <p className="text-sm text-gray-500 mt-1">Loading companies...</p>
              )}
            </div>

            <div>
              <Label htmlFor="deal_id_c">Related Deal</Label>
              <select
                id="deal_id_c"
                name="deal_id_c"
                value={formData.deal_id_c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loadingDeals}
              >
                <option value="">Select a deal</option>
                {deals.map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.Name || deal.deal_name_c}
                  </option>
                ))}
              </select>
              {loadingDeals && (
                <p className="text-sm text-gray-500 mt-1">Loading deals...</p>
              )}
            </div>

            <FormField
              label="Order Date"
              type="date"
              name="order_date_c"
              value={formData.order_date_c}
              onChange={handleChange}
            />

            <FormField
              label="Total Amount *"
              type="number"
              name="total_amount_c"
              value={formData.total_amount_c}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />

            <div>
              <Label htmlFor="status_c">Status</Label>
              <select
                id="status_c"
                name="status_c"
                value={formData.status_c}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <FormField
              label="Tags"
              type="text"
              name="Tags"
              value={formData.Tags}
              onChange={handleChange}
              placeholder="Comma-separated tags"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="shipping_address_c">Shipping Address</Label>
              <textarea
                id="shipping_address_c"
                name="shipping_address_c"
                value={formData.shipping_address_c}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter shipping address"
              />
            </div>

            <div>
              <Label htmlFor="billing_address_c">Billing Address</Label>
              <textarea
                id="billing_address_c"
                name="billing_address_c"
                value={formData.billing_address_c}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter billing address"
              />
            </div>

            <div>
              <Label htmlFor="notes_c">Notes</Label>
              <textarea
                id="notes_c"
                name="notes_c"
                value={formData.notes_c}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or comments"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              Create Sales Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}