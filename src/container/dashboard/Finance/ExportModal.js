// src/container/dashboard/Finance/ExportModal.js
import React, { useState } from 'react';
import { Modal, Button, Radio, Space, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ExportModal = ({ visible, onCancel, data, period }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    
    try {
      // Prepare the data based on selected format
      let exportData;
      if (exportFormat === 'csv') {
        exportData = convertToCSV(data);
        downloadFile(exportData, 'csv');
      } else {
        exportData = JSON.stringify(data, null, 2);
        downloadFile(exportData, 'json');
      }
      
      message.success('Export completed successfully');
      onCancel();
    } catch (error) {
      message.error('Export failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Company,Orders,Revenue,Profit,Commission'];
    
    const rows = data.companies.map(company => 
      `"${company.companyId.name}",${company.details.nbrCredit + company.details.nbrLivraison},${company.details.revenusDesVentes},${company.details.beneficeNet},${company.details.beneficeNet * 0.2}`
    );
    
    return [
      ...headers,
      ...rows,
      `TOTAL,${data.totals.totalRevenusDesVentes},${data.totals.totalRevenusDesVentes},${data.totals.totalBeneficeNet},${data.totals.totalBeneficeNet * 0.2}`
    ].join('\n');
  };

  const downloadFile = (content, extension) => {
    const blob = new Blob([content], { 
      type: extension === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${period}_${new Date().toISOString().slice(0,10)}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      title="Export Financial Data"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="export" 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={handleExport}
          loading={loading}
        >
          Export
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text>Select export format:</Text>
        <Radio.Group 
          onChange={(e) => setExportFormat(e.target.value)} 
          value={exportFormat}
        >
          <Space direction="vertical">
            <Radio value="csv">CSV (Excel compatible)</Radio>
            <Radio value="json">JSON (Full data)</Radio>
          </Space>
        </Radio.Group>
        
        <Text type="secondary">
          Exporting data for: {period === 'all' ? 'All Time' : 
          period === 'month' ? 'This Month' :
          period === 'week' ? 'This Week' : 'Today'}
        </Text>
      </Space>
    </Modal>
  );
};

export default ExportModal;