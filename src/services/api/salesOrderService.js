import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const salesOrderService = {
  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('sales_order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sales orders:", error?.response?.data?.message || error);
      toast.error('Failed to load sales orders');
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };

      const response = await apperClient.getRecordById('sales_order_c', id, params);
      
      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load sales order details');
      return null;
    }
  },

  async create(orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: orderData.Name || '',
          title_c: orderData.title_c || '',
          company_id_c: parseInt(orderData.company_id_c) || null,
          deal_id_c: parseInt(orderData.deal_id_c) || null,
          order_date_c: orderData.order_date_c || null,
          total_amount_c: parseFloat(orderData.total_amount_c) || 0,
          status_c: orderData.status_c || 'Draft',
          shipping_address_c: orderData.shipping_address_c || '',
          billing_address_c: orderData.billing_address_c || '',
          notes_c: orderData.notes_c || '',
          Tags: orderData.Tags || ''
        }]
      };

      const response = await apperClient.createRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating sales order:", error?.response?.data?.message || error);
      toast.error('Failed to create sales order');
      return null;
    }
  },

  async update(id, orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields with values
      if (orderData.Name !== undefined && orderData.Name !== '') updateData.Name = orderData.Name;
      if (orderData.title_c !== undefined && orderData.title_c !== '') updateData.title_c = orderData.title_c;
      if (orderData.company_id_c !== undefined && orderData.company_id_c !== '') updateData.company_id_c = parseInt(orderData.company_id_c);
      if (orderData.deal_id_c !== undefined && orderData.deal_id_c !== '') updateData.deal_id_c = parseInt(orderData.deal_id_c);
      if (orderData.order_date_c !== undefined && orderData.order_date_c !== '') updateData.order_date_c = orderData.order_date_c;
      if (orderData.total_amount_c !== undefined && orderData.total_amount_c !== '') updateData.total_amount_c = parseFloat(orderData.total_amount_c);
      if (orderData.status_c !== undefined && orderData.status_c !== '') updateData.status_c = orderData.status_c;
      if (orderData.shipping_address_c !== undefined && orderData.shipping_address_c !== '') updateData.shipping_address_c = orderData.shipping_address_c;
      if (orderData.billing_address_c !== undefined && orderData.billing_address_c !== '') updateData.billing_address_c = orderData.billing_address_c;
      if (orderData.notes_c !== undefined && orderData.notes_c !== '') updateData.notes_c = orderData.notes_c;
      if (orderData.Tags !== undefined && orderData.Tags !== '') updateData.Tags = orderData.Tags;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating sales order:", error?.response?.data?.message || error);
      toast.error('Failed to update sales order');
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales orders: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting sales order:", error?.response?.data?.message || error);
      toast.error('Failed to delete sales order');
      return false;
    }
  }
};