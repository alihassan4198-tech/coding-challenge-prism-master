-- Create your database tables here. Alternatively you may use an ORM
-- or whatever approach you prefer to initialize your database.
CREATE TABLE Components (
    component_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Components (name, type) 
VALUES ('Button', 'UI Element'), ('Input', 'Form Element'), ('div', 'Container');

CREATE TABLE Properties (
    property_id SERIAL PRIMARY KEY,
    component_id INT REFERENCES Components(component_id) ON DELETE CASCADE,
    name TEXT NOT NULL,                -- Property name (e.g., "margin", "padding")
    default_value TEXT,                -- Default property value (e.g., "0px")
    value TEXT,                        -- Current property value set by the user
    state TEXT CHECK (state IN ('default', 'changed', 'focused')),
    unit TEXT,                         -- Unit for the value (e.g., "px", "%", "em")
    description TEXT,                  -- Description of the property
    is_required BOOLEAN DEFAULT FALSE, -- Indicates if the property is mandatory for the component
    is_inherited BOOLEAN DEFAULT FALSE,-- If this property is inherited from a parent component
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE     -- Property activation status
);

INSERT INTO Properties (component_id, name, default_value, value, state, unit, description, is_required, is_inherited)
VALUES 
    (1, 'marginLeft', '0px', '10px', 'changed', 'px', 'Sets the outer margin', FALSE, FALSE),
    (1, 'paddingTop', '5px', '5px', 'default', 'px', 'Sets the inner padding', TRUE, TRUE),
    (2, 'height', '100%', '200px', 'focused', 'px', 'Sets the component height', TRUE, FALSE),
    (3, 'display', 'flex', 'flex', 'default', NULL, 'Defines a flex container', FALSE, FALSE),
    (3, 'flex-direction', 'row', 'row', 'default', NULL, 'Specifies the direction of flex items', FALSE, FALSE),
    (3, 'justify-content', 'flex-start', 'flex-start', 'default', NULL, 'Aligns flex items along the main axis', FALSE, FALSE),
    (3, 'align-items', 'stretch', 'stretch', 'default', NULL, 'Aligns flex items along the cross axis', FALSE, FALSE),
    (3, 'marginLeft', '0px', '10px', 'default', 'px', 'Sets the left margin of the element', FALSE, FALSE),
    (3, 'marginRight', '0px', '20px', 'default', 'px', 'Sets the right margin of the element', FALSE, FALSE),
    (3, 'marginTop', '0px', '30px', 'default', 'px', 'Sets the top margin of the element', FALSE, FALSE),
    (3, 'marginBottom', '0px', '40px', 'default', 'px', 'Sets the bottom margin of the element', FALSE, FALSE),
    (3, 'paddingTop', '0px', '50px', 'default', 'px', 'Sets the top padding of the element', FALSE, FALSE),
    (3, 'paddingBottom', '0px', '40px', 'default', 'px', 'Sets the bottom padding of the element', FALSE, FALSE),
    (3, 'paddingRight', '0px', '30px', 'default', 'px', 'Sets the right padding of the element', FALSE, FALSE),
    (3, 'paddingLeft', '0px', '20px', 'default', 'px', 'Sets the left padding of the element', FALSE, FALSE),
    (3, 'width', '100%', '100%', 'default', '%', 'Defines the width of the element', FALSE, FALSE),
    (3, 'backgroundColor', '#bf2222', '#bf2222', 'default', '', 'Defines the background color or element', FALSE, FALSE),
    (3, 'height', '100px', '100px', 'default', 'px', 'Defines the height of the element', FALSE, FALSE);

