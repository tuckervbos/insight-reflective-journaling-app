import os
from flask import Flask, request, session, redirect, jsonify
from flask_cors import CORS
from flask_migrate import Migrate, upgrade
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager, current_user
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.entry_routes import entry_routes
from .api.goal_routes import goal_routes
from .api.tag_routes import tag_routes 
from .api.milestone_routes import milestone_routes  
from .seeds import seed_commands
from .config import Config


# Initialize Flask App
app = Flask(__name__, static_folder="../react-vite/dist", static_url_path="/")
app.url_map.strict_slashes = False
# Setup Login Manager
login = LoginManager(app)
login.login_view = "auth.unauthorized"

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Register Seed Commands
app.cli.add_command(seed_commands)

# Register Blueprints
app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(entry_routes, url_prefix="/api/entries")
app.register_blueprint(goal_routes, url_prefix="/api/goals")
app.register_blueprint(tag_routes, url_prefix="/api/tags")
app.register_blueprint(milestone_routes, url_prefix="/api/milestones")

# Initialize Database and Migrations
db.init_app(app)
Migrate(app, db)

# application security 
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)

@app.after_request
def inject_csrf_token(response):
    csrf_token = generate_csrf()
    response.set_cookie(
        "csrf_token",
        csrf_token,
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

