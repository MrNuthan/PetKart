"""
PetKart Server Startup Script
==============================
Automatically applies pending migrations before starting the Django dev server.
This prevents the recurring regression where un-applied migrations cause 500 errors on product listing.

Usage:
    python start_server.py [port]
    python start_server.py          # defaults to port 8000
    python start_server.py 8080     # custom port
"""

import subprocess
import sys
import os

# Ensure we're running from the backend directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BACKEND_DIR)

PYTHON = sys.executable
MANAGE_PY = os.path.join(BACKEND_DIR, 'manage.py')


def run_command(args, desc):
    """Run a management command and print status."""
    print(f"\n{'='*50}")
    print(f"  {desc}")
    print(f"{'='*50}")
    result = subprocess.run(
        [PYTHON, MANAGE_PY] + args,
        capture_output=True, text=True
    )
    if result.stdout:
        print(result.stdout)
    if result.returncode != 0:
        print(f"  ⚠ Warning: {desc} had issues:")
        if result.stderr:
            print(result.stderr)
        return False
    return True


def main():
    port = sys.argv[1] if len(sys.argv) > 1 else '8000'

    print("\n🐾 PetKart Server Startup")
    print("=" * 50)

    # Step 1: Check for pending migrations
    print("\n🔍 Step 1: Checking for pending migrations...")
    result = subprocess.run(
        [PYTHON, MANAGE_PY, 'showmigrations', '--plan'],
        capture_output=True, text=True
    )
    
    pending = [line for line in result.stdout.splitlines() if line.strip().startswith('[ ]')]
    
    if pending:
        print(f"  ⚠ Found {len(pending)} pending migration(s):")
        for m in pending:
            print(f"    {m.strip()}")
        
        # Step 2: Apply migrations automatically
        print("\n🔧 Step 2: Applying pending migrations...")
        success = run_command(['migrate'], 'Applying migrations')
        if success:
            print("  ✅ All migrations applied successfully!")
        else:
            print("  ❌ Migration failed! Check your database connection.")
            print("     The server will still start, but some features may not work.")
    else:
        print("  ✅ All migrations are up to date!")

    # Step 3: Verify database connectivity and key tables
    print("\n🔍 Step 3: Verifying database health...")
    verify_result = subprocess.run(
        [PYTHON, '-c', 
         "import os; os.environ['DJANGO_SETTINGS_MODULE']='ecommerce_project.settings'; "
         "import django; django.setup(); "
         "from api.models import Product, Category; "
         "pc = Product.objects.count(); "
         "cc = Category.objects.count(); "
         "print('  Products: ' + str(pc)); "
         "print('  Categories: ' + str(cc)); "
         "print('  \\u2705 Database OK')"
        ],
        capture_output=True, text=True, cwd=BACKEND_DIR
    )
    if verify_result.stdout:
        print(verify_result.stdout)
    if verify_result.returncode != 0:
        print(f"  ⚠ Database health check failed:")
        if verify_result.stderr:
            # Only show the last few lines of error
            error_lines = verify_result.stderr.strip().splitlines()
            for line in error_lines[-3:]:
                print(f"    {line}")

    # Step 4: Start the server
    print(f"\n🚀 Starting Django server on port {port}...")
    print("=" * 50)
    
    try:
        subprocess.run(
            [PYTHON, MANAGE_PY, 'runserver', f'0.0.0.0:{port}'],
            cwd=BACKEND_DIR
        )
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped.")


if __name__ == '__main__':
    main()
