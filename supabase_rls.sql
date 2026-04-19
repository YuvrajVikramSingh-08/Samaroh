-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE grid_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

-- 1. Events Policies
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Auth all events" ON events FOR ALL USING (auth.role() = 'authenticated');

-- 2. Grid Zones Policies
CREATE POLICY "Public read grid_zones" ON grid_zones FOR SELECT USING (true);
CREATE POLICY "Auth all grid_zones" ON grid_zones FOR ALL USING (auth.role() = 'authenticated');

-- 3. Parking Zones Policies
CREATE POLICY "Public read parking_zones" ON parking_zones FOR SELECT USING (true);
CREATE POLICY "Auth all parking_zones" ON parking_zones FOR ALL USING (auth.role() = 'authenticated');

-- 4. Queues Policies
CREATE POLICY "Public read queues" ON queues FOR SELECT USING (true);
CREATE POLICY "Auth all queues" ON queues FOR ALL USING (auth.role() = 'authenticated');

-- 5. Schedule Items Policies
CREATE POLICY "Public read schedule_items" ON schedule_items FOR SELECT USING (true);
CREATE POLICY "Auth all schedule_items" ON schedule_items FOR ALL USING (auth.role() = 'authenticated');

-- 6. Attendees Policies
CREATE POLICY "Public read attendees" ON attendees FOR SELECT USING (true);
CREATE POLICY "Public insert attendees" ON attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth all attendees" ON attendees FOR ALL USING (auth.role() = 'authenticated');

-- 7. Complaints Policies
CREATE POLICY "Public read complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Public insert complaints" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update complaints" ON complaints FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete complaints" ON complaints FOR DELETE USING (auth.role() = 'authenticated');
