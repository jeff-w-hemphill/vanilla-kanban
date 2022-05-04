export default class kanbanAPI {
    static getItems(columnID) {
        const column = read().find(column => column.id == columnID);

        if (!column) {
            return [];
        }

        return column.items;
    }

    static insertItem(columnID, content) {
        const data = read();
        const column = data.find(column => column.id == columnID);
        const item = {
            id: Math.floor(Math.random() * 1000000),
            content, // same as -- content: content
        };

        if (!column) {
            throw new Error("Column does not exist.");
        }

        column.items.push(item); // since column is a reference to an array inside data variable, data variable is mutated
        save(data);
        
        return item;
    }

    static updateItem(itemID, newProps) {
        const data = read();
        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemID) // item in find is different than item in definion inside updateItem()
                
                if (item) {
                    return [item, column];
                }
            }
        })();

        if (!item) {
            throw new Error("Item not found.");
        }

        item.content = newProps.content === undefined ? item.content : newProps.content;

        // update column and position
        if ( newProps.columnId !== undefined && newProps.position !== undefined) {
            const targetColumn = data.find(column => column.id == newProps.columnId)

            if (!targetColumn) {
                throw new Error("Target column not found")
            }
            
            // remove item from its current column
            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);

            // move item into it's new column and position
            targetColumn.items.splice(newProps.position, 0, item);
        }   
        save(data);
    }

    static deleteItem(itemId) {
        const data = read();

        for (const column of data) {
            const item = column.items.find(item => item.id == itemId);

            if (item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }

        save(data);
    }
}

function read() {
    const json = localStorage.getItem("kanban-data");

    if (!json) {
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },   
            {
                id: 3,
                items: []
            }
        ]
    }

    return JSON.parse(json);
}

function save(data) {
    localStorage.setItem("kanban-data", JSON.stringify(data));
}

