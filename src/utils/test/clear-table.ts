import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Clears a table from Supabase
 *
 * @remarks
 * Returns the number of rows deleted
 *
 * @param tableName - Name of the table
 * @param supabase - supabaseClient instance
 *
 * @returns The number of rows
 */
export async function clearTable(
  tableName: string,
  supabase: SupabaseClient,
): Promise<number> {
  const { data: rows, error } = await supabase.from(tableName).select();

  if (error) throw new Error(error.message);

  for (const row of rows) {
    const { error } = await supabase.from(tableName).delete().eq('id', row.id);
    if (error) throw new Error(error.message);
  }

  return rows.length;
}
