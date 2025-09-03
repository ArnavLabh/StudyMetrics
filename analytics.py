import matplotlib.pyplot as plt
import numpy as np
import json
import sys
import base64
from io import BytesIO

plt.style.use('dark_background')

def create_performance_radar(user_data):
    sections = ['Foundation', 'Programming', 'Data Science', 'Degree']
    values = []
    
    # Calculate section CGPAs
    for section in ['foundation', 'programming', 'dataScience', 'degreeCore']:
        total_points = 0
        total_credits = 0
        grade_scale = {'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 4}
        
        for course_id, data in user_data.get('courses', {}).items():
            if course_id.startswith(section) and data.get('grade'):
                grade = data['grade']
                if grade in grade_scale:
                    credits = 4
                    total_points += grade_scale[grade] * credits
                    total_credits += credits
        
        cgpa = total_points / total_credits if total_credits > 0 else 0
        values.append(cgpa)
    
    # Create radar chart
    angles = np.linspace(0, 2 * np.pi, len(sections), endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(projection='polar'))
    ax.plot(angles, values, 'o-', linewidth=2, color='#00ff88')
    ax.fill(angles, values, alpha=0.25, color='#00ff88')
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(sections)
    ax.set_ylim(0, 10)
    ax.set_title('Section Performance Radar', size=16, pad=20)
    
    # Convert to base64
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', facecolor='#0c1220')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    plt.close()
    
    return f"data:image/png;base64,{image_base64}"

if __name__ == "__main__":
    user_data = json.loads(sys.argv[1])
    chart = create_performance_radar(user_data)
    print(json.dumps({"success": True, "chart": chart}))