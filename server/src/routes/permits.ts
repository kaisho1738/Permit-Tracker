import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase.js';

const router = Router();

// GET all permits
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('permits')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ permits: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST create permit
router.post('/', async (req: Request, res: Response) => {
  try {
    const permitData = req.body;
    const { data, error } = await supabase
      .from('permits')
      .insert([permitData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ permit: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// PUT update permit
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('permits')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ permit: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// DELETE permit
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('permits')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, message: `Permit #${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

export default router;
