import { Router, Response } from 'express';
import { supabase } from '../db/supabase.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

/**
 * Helper to map DB row from public.permits to the frontend Permit object shape.
 */
function mapToFrontend(p: any) {
  if (!p) return null;
  return {
    ...p,
    id: p.permit_id,
    permit_id: p.permit_id,
    plant: p.powerplant ?? p.plant ?? '',
    permit_no: p.permit_number ?? p.permit_no ?? '',
    expiry: p.expiry_date ?? p.expiry ?? '',
  };
}

/**
 * Helper to map frontend Permit body to database column payload for public.permits.
 */
function mapToDbPayload(body: any, userId?: string) {
  const {
    id,
    permit_id,
    plant,
    powerplant,
    permit_no,
    permit_number,
    expiry,
    expiry_date,
    date_issued,
    remarksAuto,
    ...rest
  } = body;

  const payload: Record<string, any> = {
    ...rest,
    powerplant: plant !== undefined ? plant : powerplant,
    permit_number: permit_no !== undefined ? permit_no : permit_number,
    expiry_date: (expiry || expiry_date) ? (expiry || expiry_date) : null,
    date_issued: date_issued ? date_issued : null,
  };

  if (userId) {
    payload.user_id = userId;
  }

  // Remove undefined values
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  return payload;
}

// GET permits for authenticated user
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from authentication' });
    }

    const { data, error } = await supabase
      .from('permits')
      .select('*')
      .eq('user_id', userId)
      .order('permit_id', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const mappedData = (data || []).map(mapToFrontend);

    return res.json({ permits: mappedData });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST batch import permits for authenticated user
router.post('/batch-import', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from authentication' });
    }

    const { permits } = req.body;
    if (!Array.isArray(permits) || permits.length === 0) {
      return res.status(400).json({ error: 'Expected a non-empty array of permits in request body' });
    }

    // 1. Ensure user profile exists in public.users to prevent FK constraint error
    const { error: userErr } = await supabase.from('users').upsert([
      { user_id: userId, email: req.user?.email }
    ], { onConflict: 'user_id' });
    if (userErr) {
      console.warn('[POST /api/permits/batch-import] Could not auto-upsert public.users record:', userErr);
    }

    // 2. Build clean payload matching database columns for each permit
    const payloads = permits.map((item) => mapToDbPayload(item, userId));

    const { data, error } = await supabase
      .from('permits')
      .insert(payloads)
      .select();

    if (error) {
      console.error('[POST /api/permits/batch-import] Supabase Batch Insert Error:', error);
      return res.status(500).json({ error: error.message, details: error });
    }

    const mappedPermits = (data || []).map(mapToFrontend);
    return res.status(201).json({
      count: mappedPermits.length,
      permits: mappedPermits,
    });
  } catch (err: any) {
    console.error('[POST /api/permits/batch-import] Server Exception:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST create permit for authenticated user
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from authentication' });
    }

    // 1. Ensure user profile exists in public.users to prevent FK constraint error
    const { error: userErr } = await supabase.from('users').upsert([
      { user_id: userId, email: req.user?.email }
    ], { onConflict: 'user_id' });
    if (userErr) {
      console.warn('[POST /api/permits] Could not auto-upsert public.users record:', userErr);
    }

    // 2. Build clean payload matching database columns
    const permitData = mapToDbPayload(req.body, userId);

    const { data, error } = await supabase
      .from('permits')
      .insert([permitData])
      .select()
      .single();

    if (error) {
      console.error('[POST /api/permits] Supabase Insert Error:', error);
      return res.status(500).json({ error: error.message, details: error });
    }

    return res.status(201).json({ permit: mapToFrontend(data) });
  } catch (err: any) {
    console.error('[POST /api/permits] Server Exception:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// PUT update permit for authenticated user
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from authentication' });
    }

    const { id } = req.params;
    const updateData = mapToDbPayload(req.body);

    const { data, error } = await supabase
      .from('permits')
      .update(updateData)
      .eq('permit_id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ permit: mapToFrontend(data) });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// DELETE permit for authenticated user
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User ID missing from authentication' });
    }

    const { id } = req.params;

    const { error } = await supabase
      .from('permits')
      .delete()
      .eq('permit_id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: `Permit #${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
