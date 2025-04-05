//  This is a mock implementation since we're not actually connecting to Supabase
// In a production environment, this would use actual Supabase credentials

export const supabase = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          // Mock the response
          then: (callback: Function) => {
            // We'll use our mock data instead
            callback({ data: [], error: null });
            return { data: [], error: null };
          }
        }),
        // Mock the response
        then: (callback: Function) => {
          callback({ data: [], error: null });
          return { data: [], error: null };
        }
      }),
      gte: (column: string, value: any) => ({
        lte: (column: string, value: any) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            // Mock the response
            then: (callback: Function) => {
              callback({ data: [], error: null });
              return { data: [], error: null };
            }
          })
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          // Mock the response
          then: (callback: Function) => {
            callback({ data: [], error: null });
            return { data: [], error: null };
          }
        })
      }),
      lte: (column: string, value: any) => ({
        order: (column: string, { ascending }: { ascending: boolean }) => ({
          // Mock the response
          then: (callback: Function) => {
            callback({ data: [], error: null });
            return { data: [], error: null };
          }
        })
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        // Mock the response
        then: (callback: Function) => {
          callback({ data: [], error: null });
          return { data: [], error: null };
        }
      })
    }),
    insert: (records: any[]) => ({
      select: () => ({
        // Mock the response
        then: (callback: Function) => {
          callback({ data: records, error: null });
          return { data: records, error: null };
        }
      })
    })
  })
};
 