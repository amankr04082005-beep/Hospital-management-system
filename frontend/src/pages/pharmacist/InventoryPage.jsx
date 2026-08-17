import { useEffect, useState } from 'react';
import { Card, Button, Field } from '../../components/common/ui';
import * as medicineService from '../../services/medicine.service';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  brandName: '',
  genericName: '',
  composition: '',
  manufacturer: '',
  form: 'tablet',
  category: '',
  stockQuantity: '',
  lowStockThreshold: '10',
  expiryDate: '',
};

// SRS Module 2.4 — Pharmacist permission: Manage Inventory.
export default function InventoryPage() {
  const [medicines, setMedicines] = useState(null);
  const [adjustingId, setAdjustingId] = useState(null);
  const [adjustment, setAdjustment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedicine, setNewMedicine] = useState(EMPTY_FORM);
  const [addSubmitting, setAddSubmitting] = useState(false);

  async function load() {
    try {
      const data = await medicineService.getInventory();
      setMedicines(data);
    } catch {
      setMedicines([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openAdjust(id) {
    setAdjustingId(id);
    setAdjustment('');
  }

  async function handleAdjust(e) {
    e.preventDefault();
    const value = Number(adjustment);
    if (!value) {
      toast.error('Enter a non-zero number (positive to restock, negative to remove stock).');
      return;
    }
    setSubmitting(true);
    try {
      await medicineService.updateStock(adjustingId, value);
      toast.success('Stock updated.');
      setAdjustingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update stock.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleNewMedicineChange(field, value) {
    setNewMedicine((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAddMedicine(e) {
    e.preventDefault();
    if (!newMedicine.brandName.trim() || !newMedicine.genericName.trim() || !newMedicine.composition.trim()) {
      toast.error('Brand name, generic name, and composition are required.');
      return;
    }
    setAddSubmitting(true);
    try {
      const payload = {
        ...newMedicine,
        stockQuantity: Number(newMedicine.stockQuantity) || 0,
        lowStockThreshold: Number(newMedicine.lowStockThreshold) || 10,
        expiryDate: newMedicine.expiryDate || undefined,
      };
      await medicineService.addMedicine(payload);
      toast.success('Medicine added to inventory.');
      setNewMedicine(EMPTY_FORM);
      setShowAddForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add medicine.');
    } finally {
      setAddSubmitting(false);
    }
  }

  if (medicines === null) return <p style={{ color: 'var(--ink-soft)' }}>Loading…</p>;

  const lowStockCount = medicines.filter((m) => m.stockQuantity <= m.lowStockThreshold).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Manage inventory</h1>
          <p style={{ color: 'var(--ink-soft)' }}>
            Track medicine stock levels and restock before items run out.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddForm((v) => !v)}>
          {showAddForm ? 'Cancel' : '+ Add medicine'}
        </Button>
      </div>

      {showAddForm && (
        <Card style={{ marginBottom: 20 }}>
          <form onSubmit={handleAddMedicine}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Brand name *">
                <input
                  value={newMedicine.brandName}
                  onChange={(e) => handleNewMedicineChange('brandName', e.target.value)}
                  placeholder="e.g. Dolo 650"
                />
              </Field>
              <Field label="Generic name *">
                <input
                  value={newMedicine.genericName}
                  onChange={(e) => handleNewMedicineChange('genericName', e.target.value)}
                  placeholder="e.g. Paracetamol"
                />
              </Field>
              <Field label="Composition *">
                <input
                  value={newMedicine.composition}
                  onChange={(e) => handleNewMedicineChange('composition', e.target.value)}
                  placeholder="e.g. Paracetamol 650mg"
                />
              </Field>
              <Field label="Manufacturer">
                <input
                  value={newMedicine.manufacturer}
                  onChange={(e) => handleNewMedicineChange('manufacturer', e.target.value)}
                  placeholder="e.g. Micro Labs"
                />
              </Field>
              <Field label="Form">
                <select
                  value={newMedicine.form}
                  onChange={(e) => handleNewMedicineChange('form', e.target.value)}
                >
                  <option value="tablet">Tablet</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="capsule">Capsule</option>
                  <option value="ointment">Ointment</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <Field label="Category">
                <input
                  value={newMedicine.category}
                  onChange={(e) => handleNewMedicineChange('category', e.target.value)}
                  placeholder="e.g. Analgesic"
                />
              </Field>
              <Field label="Initial stock quantity">
                <input
                  type="number"
                  value={newMedicine.stockQuantity}
                  onChange={(e) => handleNewMedicineChange('stockQuantity', e.target.value)}
                  placeholder="0"
                />
              </Field>
              <Field label="Low stock threshold">
                <input
                  type="number"
                  value={newMedicine.lowStockThreshold}
                  onChange={(e) => handleNewMedicineChange('lowStockThreshold', e.target.value)}
                  placeholder="10"
                />
              </Field>
              <Field label="Expiry date">
                <input
                  type="date"
                  value={newMedicine.expiryDate}
                  onChange={(e) => handleNewMedicineChange('expiryDate', e.target.value)}
                />
              </Field>
            </div>
            <div style={{ marginTop: 14 }}>
              <Button type="submit" disabled={addSubmitting}>
                {addSubmitting ? 'Adding…' : 'Add medicine'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {lowStockCount > 0 && (
        <div
          style={{
            background: '#fdf3e7', border: '1px solid #e8c98f', borderRadius: 8,
            padding: '10px 14px', marginBottom: 20, fontSize: 13.5, color: '#7a5414',
          }}
        >
          ⚠ {lowStockCount} medicine{lowStockCount > 1 ? 's are' : ' is'} at or below the low-stock threshold.
        </div>
      )}

      <Card>
        <table style={{ width: '100%', fontSize: 13.5, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px' }}>Medicine</th>
              <th style={{ padding: '8px' }}>Composition</th>
              <th style={{ padding: '8px' }}>Stock</th>
              <th style={{ padding: '8px' }}>Status</th>
              <th style={{ padding: '8px' }}>Last restocked</th>
              <th style={{ padding: '8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => {
              const low = m.stockQuantity <= m.lowStockThreshold;
              return (
                <>
                  <tr key={m._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{m.brandName}</td>
                    <td style={{ padding: '8px', color: 'var(--ink-soft)' }}>{m.composition}</td>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{m.stockQuantity}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ color: low ? '#a33' : 'var(--teal-dark)', fontWeight: 600 }}>
                        {low ? 'Low stock' : 'OK'}
                      </span>
                    </td>
                    <td style={{ padding: '8px', color: 'var(--ink-soft)' }}>
                      {m.lastRestockedAt ? new Date(m.lastRestockedAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      <Button size="sm" variant="secondary" onClick={() => openAdjust(m._id)}>
                        Update stock
                      </Button>
                    </td>
                  </tr>
                  {adjustingId === m._id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '8px 8px 16px' }}>
                        <form onSubmit={handleAdjust} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                          <Field label="Adjustment (+ to add, − to remove)" style={{ marginBottom: 0 }}>
                            <input
                              type="number"
                              autoFocus
                              value={adjustment}
                              onChange={(e) => setAdjustment(e.target.value)}
                              placeholder="e.g. 50 or -5"
                            />
                          </Field>
                          <Button type="submit" size="sm" disabled={submitting}>
                            {submitting ? 'Saving…' : 'Save'}
                          </Button>
                          <Button type="button" size="sm" variant="secondary" onClick={() => setAdjustingId(null)}>
                            Cancel
                          </Button>
                        </form>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}