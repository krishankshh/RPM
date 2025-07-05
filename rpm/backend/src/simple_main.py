import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
CORS(app, origins=['*'])

@app.route('/')
def home():
    """Serve the main React app"""
    static_folder_path = app.static_folder
    if static_folder_path and os.path.exists(os.path.join(static_folder_path, 'index.html')):
        return send_from_directory(static_folder_path, 'index.html')
    else:
        return jsonify({
            'status': 'success',
            'message': 'AI Tutoring Platform API is running!',
            'version': '1.0.0',
            'note': 'Frontend not built yet'
        })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI Tutoring Platform API is running',
        'version': '1.0.0'
    })

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Mock Google OAuth endpoint for testing"""
    return jsonify({
        'status': 'error',
        'message': 'Google OAuth not configured yet. Please set up environment variables.',
        'note': 'This is a development placeholder'
    }), 501

@app.route('/<path:path>')
def serve_static(path):
    """Serve static files or fallback to index.html for SPA routing"""
    static_folder_path = app.static_folder
    if static_folder_path and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    elif static_folder_path and os.path.exists(os.path.join(static_folder_path, 'index.html')):
        return send_from_directory(static_folder_path, 'index.html')
    else:
        return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

