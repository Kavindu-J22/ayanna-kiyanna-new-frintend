// Enhanced Receipt Generator with Professional Design
export const generateReceiptHTML = (order, getStatusLabel) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${order.orderId}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', 'Noto Sans Sinhala', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
          padding: 20px;
        }
        
        .receipt-container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        
        .logo-section {
          position: relative;
          z-index: 2;
          margin-bottom: 20px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.8);
        }

        .logo img {
          width: 70px;
          height: 70px;
          object-fit: contain;
          border-radius: 50%;
        }

        .logo-fallback {
          font-family: 'Noto Sans Sinhala', sans-serif;
          font-size: 2.5em;
          font-weight: 900;
          color: #667eea;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .company-name {
          font-size: 2.2em;
          font-weight: 700;
          margin-bottom: 5px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          position: relative;
          z-index: 2;
        }
        
        .company-subtitle {
          font-size: 1.1em;
          opacity: 0.9;
          font-weight: 400;
          position: relative;
          z-index: 2;
        }
        
        .receipt-title {
          background: rgba(255,255,255,0.15);
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 1.2em;
          font-weight: 600;
          margin-top: 20px;
          display: inline-block;
          position: relative;
          z-index: 2;
        }
        
        .content {
          padding: 40px;
        }
        
        .order-info {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 1px solid #dee2e6;
          position: relative;
        }
        
        .order-info::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
        }
        
        .section {
          margin-bottom: 30px;
          background: #fafbfc;
          padding: 25px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
        }
        
        .section h3 {
          color: #495057;
          font-size: 1.4em;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #667eea;
          position: relative;
        }
        
        .section h3::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: #764ba2;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s;
        }
        
        .item-row:hover {
          background-color: rgba(102, 126, 234, 0.05);
          border-radius: 6px;
          margin: 0 -10px;
          padding: 15px 10px;
        }
        
        .item-row:last-child {
          border-bottom: none;
        }
        
        .item-name {
          font-weight: 600;
          color: #495057;
          margin-bottom: 4px;
        }
        
        .item-details {
          font-size: 0.9em;
          color: #6c757d;
        }
        
        .item-price {
          font-weight: 700;
          color: #495057;
          font-size: 1.1em;
        }
        
        .total-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-top: 30px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 1.05em;
        }
        
        .total-row.final {
          font-size: 1.4em;
          font-weight: 700;
          border-top: 2px solid rgba(255,255,255,0.3);
          padding-top: 20px;
          margin-top: 20px;
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 8px;
          margin-left: -15px;
          margin-right: -15px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
        }
        
        .info-label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 4px;
          font-size: 0.9em;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          color: #212529;
          font-size: 1.05em;
        }
        
        .footer {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: #6c757d;
          border-top: 1px solid #dee2e6;
        }
        
        .footer-logo {
          width: 40px;
          height: 40px;
          background: #667eea;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .status-badge {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85em;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .status-approved { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .status-pending { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
        .status-rejected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .status-completed { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .status-cancelled { background: #e2e3e5; color: #383d41; border: 1px solid #d6d8db; }
        
        @media print {
          body { background: white; padding: 0; }
          .receipt-container { box-shadow: none; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="logo-section">
            <div class="logo">
              <img src="/src/assets/AKlogo.png" alt="AK Logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
              <div class="logo-fallback" style="display: none;">අ</div>
            </div>
            <div class="company-name">අයන්න කියන්න</div>
            <div class="company-subtitle">AYANNA KIYANNA INSTITUTE</div>
            <div class="receipt-title">ඇණවුම් රිසිට්පත</div>
          </div>
        </div>
        
        <div class="content">
          <div class="order-info">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
              <div>
                <div style="font-size: 1.3em; font-weight: 700; color: #495057; margin-bottom: 8px;">
                  ඇණවුම් අංකය: ${order.orderId}
                </div>
                <div style="color: #6c757d; font-size: 1.05em;">
                  ඇණවුම් දිනය: ${new Date(order.createdAt).toLocaleDateString('si-LK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div style="color: #6c757d; font-size: 0.95em; margin-top: 4px;">
                  රිසිට්පත ජනනය: ${new Date().toLocaleDateString('si-LK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div class="status-badge status-${order.status}">
                ${getStatusLabel(order.status)}
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>පාරිභෝගික තොරතුරු</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">පාරිභෝගික නම</div>
                <div class="info-value">${order.user?.fullName || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ඊමේල් ලිපිනය</div>
                <div class="info-value">${order.userEmail}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>ඇණවුම් විස්තර</h3>
            ${order.items.map(item => `
              <div class="item-row">
                <div>
                  <div class="item-name">${item.productName}</div>
                  <div class="item-details">${item.quantity} × Rs. ${item.priceAtTime.toLocaleString()}</div>
                </div>
                <div class="item-price">
                  Rs. ${(item.quantity * item.priceAtTime).toLocaleString()}
                </div>
              </div>
            `).join('')}
          </div>
          
          ${order.deliveryType === 'delivery' ? `
          <div class="section">
            <h3>ගෙන්වා දීමේ ලිපිනය</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">ලබන්නාගේ නම</div>
                <div class="info-value">${order.deliveryInfo?.recipientName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">දුරකථන අංකය</div>
                <div class="info-value">${order.deliveryInfo?.contactNumber}</div>
              </div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
              <div class="info-label">ලිපිනය</div>
              <div class="info-value">${order.deliveryInfo?.address}</div>
            </div>
            <div class="info-item" style="margin-top: 15px;">
              <div class="info-label">දිස්ත්‍රික්කය</div>
              <div class="info-value">${order.deliveryInfo?.district}</div>
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <h3>ගෙවීම් සහ ගෙන්වා දීමේ තොරතුරු</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">ගෙවීම් ක්‍රමය</div>
                <div class="info-value">${order.paymentMethod === 'bank_transfer' ? 'බැංකු මාරුව' : 'ලබා ගන්නා විට ගෙවීම'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">ගෙන්වා දීමේ ක්‍රමය</div>
                <div class="info-value">${order.deliveryType === 'delivery' ? 'ගෙන්වා දීම' : 'ආයතනයෙන් ලබා ගැනීම'}</div>
              </div>
            </div>
            ${order.paidInPerson ? '<div style="color: #28a745; font-weight: bold; margin-top: 15px; padding: 10px; background: #d4edda; border-radius: 6px; border: 1px solid #c3e6cb;">✓ පුද්ගලිකව ගෙවන ලදි</div>' : ''}
          </div>
          
          <div class="total-section">
            <div class="total-row">
              <span>උප එකතුව:</span>
              <span>Rs. ${order.subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>වට්ටම්:</span>
              <span>- Rs. ${order.totalDiscount.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>ගෙන්වා දීමේ ගාස්තුව:</span>
              <span>Rs. ${order.deliveryCharge.toLocaleString()}</span>
            </div>
            <div class="total-row final">
              <span>මුළු ගෙවිය යුතු මුදල:</span>
              <span>Rs. ${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">අ</div>
          <div style="font-size: 1.1em; font-weight: 600; color: #495057; margin-bottom: 10px;">
            අයන්න කියන්න ආයතනය
          </div>
          <div style="margin-bottom: 15px; color: #6c757d;">
            ගුණාත්මක අධ්‍යාපනය සහ නිෂ්පාදන සේවාව
          </div>
          <div style="font-size: 0.9em; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 15px;">
            ඔබගේ ඇණවුම සඳහා ස්තූතියි! | www.ayannakiyanna.com
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadReceipt = (order, getStatusLabel) => {
  const receiptHTML = generateReceiptHTML(order, getStatusLabel);
  
  // Create a new window and print as PDF
  const printWindow = window.open('', '_blank');
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  
  // Wait for content to load then trigger print
  printWindow.onload = function() {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
};
