import { supabase } from '../lib/supabase';
import { Plan, BudgetItem, Vendor, RSVP, ChecklistItem, TimelineItem } from '../types';

export const databaseService = {
  /**
   * Fetch all projects for the current user
   */
  async fetchProjects(): Promise<Plan[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('plan_data')
      .eq('user_id', user.id);

    if (error) throw error;
    
    return data ? data.map(row => row.plan_data as Plan) : [];
  },

  /**
   * Create a new project
   */
  async createProject(plan: Plan): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .insert({
        id: plan.id,
        user_id: user.id,
        event_name: plan.name,
        event_type: plan.type,
        city: plan.city,
        guest_count: plan.guestCount,
        plan_data: plan
      });

    if (error) throw error;

    // Sync relational data
    await this.syncRelationalData(plan);
  },

  /**
   * Update an existing project
   */
  async updateProject(plan: Plan): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .update({
        event_name: plan.name,
        event_type: plan.type,
        city: plan.city,
        guest_count: plan.guestCount,
        plan_data: plan
      })
      .eq('id', plan.id)
      .eq('user_id', user.id);

    if (error) throw error;

    // Sync relational data
    await this.syncRelationalData(plan);
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  /**
   * Sync relational data (Budget Items, Vendors, Guests, Checklist, Timeline)
   * This ensures the relational tables are kept in sync with the plan_data JSONB
   */
  async syncRelationalData(plan: Plan): Promise<void> {
    // 0. Sync Functions
    if ('functions' in plan && Array.isArray(plan.functions)) {
      const functions = plan.functions.map(fName => ({
        id: `${plan.id}-${fName.replace(/\s+/g, '-').toLowerCase()}`,
        project_id: plan.id,
        function_name: fName,
        guest_count: plan.guestCount
      }));
      if (functions.length > 0) {
        await supabase.from('functions').upsert(functions, { onConflict: 'id' });
      }
    }

    // 1. Sync Budget Items
    if (plan.categories) {
      const budgetItems = plan.categories.flatMap(cat => 
        cat.items.map(item => ({
          id: item.id,
          project_id: plan.id,
          category: cat.name,
          item_name: item.label,
          estimated_cost: item.cost,
          actual_cost: item.cost, // Assuming actual is same as estimated for now if not tracked separately
          side_assignment: item.side || null,
          notes: item.description || null
        }))
      );
      
      if (budgetItems.length > 0) {
        await supabase.from('budget_items').upsert(budgetItems, { onConflict: 'id' });
      }
    }

    // 2. Sync Vendors
    if (plan.vendors && plan.vendors.length > 0) {
      const vendors = plan.vendors.map(v => ({
        id: v.id,
        project_id: plan.id,
        vendor_name: v.name,
        category: v.category,
        cost: v.budgetedAmount,
        payment_status: v.actualPaid >= v.budgetedAmount ? 'PAID' : 'PENDING',
        contact_info: v.contact,
        notes: v.notes
      }));
      await supabase.from('vendors').upsert(vendors, { onConflict: 'id' });
    }

    // 3. Sync Guests (RSVPs)
    if (plan.rsvps && plan.rsvps.length > 0) {
      const guests = plan.rsvps.map(g => ({
        id: g.id,
        project_id: plan.id,
        guest_name: g.name,
        side: null, // Not tracked in RSVP
        rsvp_status: g.status,
        notes: g.dietaryRestrictions || null
      }));
      await supabase.from('guests').upsert(guests, { onConflict: 'id' });
    }

    // 4. Sync Checklist Tasks
    if (plan.checklist && plan.checklist.length > 0) {
      const tasks = plan.checklist.map(t => ({
        id: t.id,
        project_id: plan.id,
        task_name: t.task,
        status: t.completed ? 'COMPLETED' : 'PENDING',
        priority: 'NORMAL'
      }));
      await supabase.from('checklist_tasks').upsert(tasks, { onConflict: 'id' });
    }

    // 5. Sync Timeline Events
    if (plan.timeline && plan.timeline.length > 0) {
      const events = plan.timeline.map(t => ({
        id: t.id,
        project_id: plan.id,
        event_name: t.activity,
        event_time: t.time,
        notes: t.notes || null
      }));
      await supabase.from('timeline_events').upsert(events, { onConflict: 'id' });
    }
  },

  // --- Fine-grained functions as requested ---

  async saveBudgetItem(projectId: string, item: BudgetItem, categoryName: string): Promise<void> {
    const { error } = await supabase.from('budget_items').upsert({
      id: item.id,
      project_id: projectId,
      category: categoryName,
      item_name: item.label,
      estimated_cost: item.cost,
      actual_cost: item.cost,
      side_assignment: item.side || null,
      notes: item.description || null
    });
    if (error) throw error;
  },

  async updateVendor(projectId: string, vendor: Vendor): Promise<void> {
    const { error } = await supabase.from('vendors').upsert({
      id: vendor.id,
      project_id: projectId,
      vendor_name: vendor.name,
      category: vendor.category,
      cost: vendor.budgetedAmount,
      payment_status: vendor.actualPaid >= vendor.budgetedAmount ? 'PAID' : 'PENDING',
      contact_info: vendor.contact,
      notes: vendor.notes
    });
    if (error) throw error;
  },

  async deleteGuest(guestId: string): Promise<void> {
    const { error } = await supabase.from('guests').delete().eq('id', guestId);
    if (error) throw error;
  }
};
