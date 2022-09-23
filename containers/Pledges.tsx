import { FunctionComponent } from "react";
import { PlusIcon, CheckIcon, XIcon, PhoneIcon, MailIcon } from "@heroicons/react/solid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// components
import { InputText } from "../components/Input";
import { Select } from "../components/Select";
import Button from "../components/Button";
import { ToggleArea } from "../components/Disclosure";

interface Pledge{
    id: number;
    name: string;
    contactNumber: string;
    email: string;
    items: {
        id: number;
        name: string;
        quantity: number;
        until: string;
    }[];
}

const PledgeItem: FunctionComponent = () => {
    return (
        <div className="flex justify-between bg-white py-2 px-4 rounded-md">
            <div className="flex flex-col gap-2">
                <h6 className="text-lg font-semibold">Nisal Periyapperuma</h6>
                <div className="mb-2">
                    <span className="p-2 bg-emerald-800 text-white rounded-md">10 Items</span>
                </div>
                <span className="flex gap-1 items-center"><PhoneIcon className="w-4 h-4" /> 0764520540</span>
                <span className="flex gap-1 items-center"><MailIcon className="w-4 h-4" /> nisalp@gmail.com</span>
                <span className="text-sm text-gray-400">Updated 2 days ago</span>
            </div>
            <div className="flex flex-col h-fit">
                <Button type="secondary" onMouseDown={() => {}}>
                    <CheckIcon className="text-white w-4 h-4" />
                </Button>
                <Button type="danger" onMouseDown={() => {}}>
                    <XIcon className="text-white w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

const groups = [
    {
        key: "pledged",
        label: "Pledged",
        backgroundClass: "bg-gray-50",
    },
    {
        key: "contacted",
        label: "Contacted",
        backgroundClass: "bg-blue-50",
    },
    {
        key: "fulfilled",
        label: "Fulfilled",
        backgroundClass: "bg-emerald-50",
    },
    {
        key: "inactive",
        label: "Inactive",
        backgroundClass: "bg-red-50",
    },
]

const Pledges: FunctionComponent = () => {
    return (
        <div className="pb-4">
            <div className="pb-1 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Pledges</h2>
            </div>
            <div className="py-4 flex">
                <InputText 
                    placeholder="Search for pledges"
                />
            </div>
            <div className="flex overflow-x-scroll gap-2">
                <DragDropContext onDragEnd={(e) => {
                    console.log("HELLO");
                    console.log(e);
                }}>
                {groups.map((group, i) => (
                    <Droppable
                        key={i}
                        droppableId={group.key}
                    >
                        {(provided, snapshot) => (
                            <div 
                                ref={provided.innerRef}
								{...provided.droppableProps}
                                className={`col-span-1 p-4 ${group.backgroundClass} rounded-md min-w-[400px]`}
                            >
                                <h4 className="text-lg font-extrabold text-slate-500 mb-2">{group.label}</h4>
                                <div className="flex flex-col gap-2">
                                    {["Onions", "Garlic", "Carrots", "Pumpkins", "Rice"].map((item, j) => (
                                        <Draggable
                                            key={`${item}-${i}-${j}`}
                                            draggableId={`${item}-${i}-${j}`}
                                            isDragDisabled={false}
                                            index={j}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                >
                                                    <PledgeItem />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                ))}
                </DragDropContext>
            </div>
        </div>
    )
}

export default Pledges;