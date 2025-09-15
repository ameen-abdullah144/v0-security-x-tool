-- Seed sample data for development and testing

-- Insert sample devices (these will be visible to all authenticated users)
INSERT INTO public.devices (name, device_type, ip_address, mac_address, operating_system, status, location) VALUES
('Web Server 01', 'server', '192.168.1.10', '00:1B:44:11:3A:B7', 'Ubuntu 22.04 LTS', 'active', 'Data Center A'),
('Database Server', 'server', '192.168.1.11', '00:1B:44:11:3A:B8', 'CentOS 8', 'active', 'Data Center A'),
('Admin Workstation', 'workstation', '192.168.1.100', '00:1B:44:11:3A:C1', 'Windows 11 Pro', 'active', 'Office Floor 2'),
('Security Camera 01', 'iot', '192.168.1.201', '00:1B:44:11:3A:D1', 'Embedded Linux', 'active', 'Building Entrance'),
('Network Switch', 'network', '192.168.1.1', '00:1B:44:11:3A:E1', 'Cisco IOS', 'active', 'Network Closet'),
('Mobile Device', 'mobile', '192.168.1.150', '00:1B:44:11:3A:F1', 'iOS 17', 'inactive', 'Remote'),
('Backup Server', 'server', '192.168.1.12', '00:1B:44:11:3A:B9', 'Ubuntu 20.04 LTS', 'maintenance', 'Data Center B');

-- Insert sample security events
INSERT INTO public.security_events (device_id, event_type, severity, title, description, source_ip, status) VALUES
((SELECT id FROM public.devices WHERE name = 'Web Server 01'), 'login_attempt', 'medium', 'Multiple Failed Login Attempts', 'Detected 5 failed SSH login attempts from external IP', '203.0.113.45', 'open'),
((SELECT id FROM public.devices WHERE name = 'Database Server'), 'suspicious_activity', 'high', 'Unusual Database Query Pattern', 'Detected unusual SELECT queries accessing sensitive tables', '192.168.1.100', 'investigating'),
((SELECT id FROM public.devices WHERE name = 'Admin Workstation'), 'malware_detected', 'critical', 'Trojan Horse Detected', 'Windows Defender detected Trojan:Win32/Wacatac.B!ml', NULL, 'open'),
((SELECT id FROM public.devices WHERE name = 'Network Switch'), 'network_intrusion', 'high', 'Port Scanning Activity', 'Detected systematic port scanning from external source', '198.51.100.23', 'open'),
((SELECT id FROM public.devices WHERE name = 'Security Camera 01'), 'system_anomaly', 'medium', 'Unusual Network Traffic', 'Camera sending unexpected data volumes', NULL, 'resolved');

-- Insert sample alerts based on security events
INSERT INTO public.alerts (event_id, priority, status, notes) VALUES
((SELECT id FROM public.security_events WHERE title = 'Multiple Failed Login Attempts'), 'medium', 'new', 'Monitoring for additional attempts'),
((SELECT id FROM public.security_events WHERE title = 'Unusual Database Query Pattern'), 'high', 'acknowledged', 'Investigating query patterns and user access'),
((SELECT id FROM public.security_events WHERE title = 'Trojan Horse Detected'), 'urgent', 'in_progress', 'Isolating workstation and running full system scan'),
((SELECT id FROM public.security_events WHERE title = 'Port Scanning Activity'), 'high', 'new', 'Blocking source IP and monitoring for additional activity'),
((SELECT id FROM public.security_events WHERE title = 'Unusual Network Traffic'), 'medium', 'resolved', 'Camera firmware updated, traffic normalized');

-- Insert sample detection rules
INSERT INTO public.detection_rules (name, description, rule_type, conditions, severity, enabled) VALUES
('Failed Login Threshold', 'Alert when more than 3 failed login attempts occur within 5 minutes', 'threshold', '{"event_type": "login_attempt", "threshold": 3, "timeframe": "5m"}', 'medium', true),
('Critical System File Access', 'Alert when critical system files are accessed unexpectedly', 'signature', '{"file_paths": ["/etc/passwd", "/etc/shadow", "C:\\Windows\\System32\\config\\SAM"], "action": "read"}', 'high', true),
('Unusual Network Traffic Volume', 'Alert when network traffic exceeds normal patterns', 'anomaly', '{"metric": "network_bytes", "threshold_multiplier": 3, "baseline_period": "24h"}', 'medium', true),
('Malware Signature Detection', 'Alert on known malware signatures', 'signature', '{"signatures": ["trojan", "ransomware", "backdoor"], "scan_type": "realtime"}', 'critical', true);
