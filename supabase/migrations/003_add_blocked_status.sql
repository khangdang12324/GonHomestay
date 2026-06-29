-- Add BLOCKED to bookings status check constraint

-- First, drop the existing constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add the new constraint with 'BLOCKED' included
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'BLOCKED'));
