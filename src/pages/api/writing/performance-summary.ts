import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/lib/db'; // adjust if your DB connection path is different

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await pool.query(`
      SELECT
        type,
        subtype,
        COUNT(*) AS total,
        ROUND(AVG(band::NUMERIC), 1) AS avg_band
      FROM writing_submissions
      WHERE
        band ~ '^[0-9]+(\\.[0-9]+)?$' AND
        created_at > NOW() - INTERVAL '30 days'
      GROUP BY type, subtype;
    `);

    res.status(200).json(result.rows);
  } catch (err: any) {
    console.error('❌ Error fetching performance summary:', err.message);
    res.status(500).json({ error: err.message });
  }
}
