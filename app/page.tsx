"use client";
import {useState} from "react";
import {siteConfig} from "@/config/site";
import {Link} from "@heroui/link";
import {Alert} from "@heroui/alert";
import {Snippet} from "@heroui/snippet";
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Divider} from "@heroui/divider";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {BinIcon} from "@/components/icons";
import {UserMinusIcon, UserPlusIcon} from "@/components/icons";
import {Item, Participant, Transaction, calculateTransactions} from "@/lib/calculateTransaction";

export default function Home() {
    const [participants, setParticipants] = useState<(Participant & { id: number })[]>([
        {id: Date.now(), name: "", paymentDetails: "", items: []},
    ]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [error, setError] = useState<string | null>(null);

    // add new participants
    const addParticipant = () => {
        setParticipants((prev) => [
            ...prev,
            {id: Date.now(), name: "", paymentDetails: "", items: []},
        ]);
    };

    // update participant (name / paymentDetails)
    const updateParticipant = (id: number, key: keyof Participant, value: string) => {
        setParticipants((prev) =>
            prev.map((p) =>
                p.id === id ? {...p, [key]: value} : p));
    };

    // remove participant
    const removeParticipant = (id: number) => {
        setParticipants((prev) => prev.filter((p) => p.id !== id));
    }

    const addItem = (participantIndex: number) => {
        setParticipants((prev) =>
            prev.map((p, i) =>
                i === participantIndex
                    ? {...p, items: [...p.items, {itemName: "", price: 0}]}
                    : p
            )
        );
    };

    const updateItem = (participantIndex: number, itemIndex: number, key: keyof Item, value: string | number) => {
        setParticipants((prev) =>
            prev.map((p, i) =>
                i === participantIndex
                    ? {
                        ...p,
                        items: p.items.map((item, j) =>
                            j === itemIndex ? {...item, [key]: value} : item
                        ),
                    }
                    : p
            )
        );
    };

    const removeItem = (participantIndex: number, itemIndex: number) => {
        setParticipants((prev) =>
            prev.map((p, i) =>
                i === participantIndex
                    ? {...p, items: p.items.filter((_, j) => j !== itemIndex)}
                    : p
            )
        );
    };

    const totalAmount = participants.reduce(
        (sum, participant) => sum + participant.items.reduce((s, item) => s + (isNaN(item.price) ? 0 : item.price), 0),
        0
    );

    const handleCalculate = () => {
        if (participants.length < 2) {
            setError("Should be more than 1 participants")

            return;
        }

        if (totalAmount === 0) {
            setError("Total amount is 0")

            return;
        }

        if (participants.some((p) => p.items.length > 0 && p.name.trim() === "")) {
            setError("Name of every participants is required.");

            return;
        }

        setError(null);
        setTransactions(calculateTransactions(participants));
    };

    return (
        <section className="flex flex-col items-center justify-start">
            {/* ----- Participants and Items ----- */}
            <div className="inline-block text-center justify-center w-full md:w-9/12">
                {participants.map((participant, participantIndex) => (
                    <Card key={participant.id} className="my-4">
                        <CardHeader className="flex items-center gap-2">
                            <Input isRequired
                                   color="primary"
                                   label="Name" type="text"
                                   onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                            />
                            <Input label="PayId" type="text"
                                   onChange={(e) => updateParticipant(participant.id, "paymentDetails", e.target.value)}
                            />
                            <Button
                                isIconOnly
                                color="danger"
                                variant="bordered"
                                onPress={() => removeParticipant(participant.id)}
                            >
                                <UserMinusIcon/>
                            </Button>
                        </CardHeader>
                        <Divider/>
                        {participant.items.length > 0 &&
                            <CardBody>
                                {participant.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center gap-2">
                                        <Input
                                            label="Item" type="text" value={item.itemName}
                                            onChange={(e) => updateItem(participantIndex, itemIndex, "itemName", e.target.value)}
                                        />
                                        <Input
                                            label="Price"
                                            placeholder="0.00"
                                            type="number"
                                            value={item.price.toString()}
                                            onChange={(e) => {
                                                const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                                updateItem(participantIndex, itemIndex, "price", newValue);
                                            }}
                                            endContent={<span className="text-default-400 text-small">AUD</span>}
                                        />
                                        <Button isIconOnly className="px-0" color="danger"
                                                variant="bordered"
                                                onPress={() => removeItem(participantIndex, itemIndex)}>
                                            <BinIcon/>
                                        </Button>
                                    </div>
                                ))}
                            </CardBody>}
                        <Divider/>
                        <CardFooter className="flex justify-between items-center">
                            <Button className="mt-2" color="success" variant="bordered"
                                    onPress={() => addItem(participantIndex)}>
                                ➕ Add New Item
                            </Button>
                            <p className="font-semibold">
                                AUD{" "}
                                {participant.items.reduce((sum, item) => sum + (isNaN(item.price) ? 0 : item.price), 0).toFixed(2)}
                            </p>

                        </CardFooter>
                    </Card>
                ))}
            </div>
            <Button className="mt-2 mb-4" color="primary" variant="bordered" onPress={addParticipant}>
                Add Participant <UserPlusIcon/>
            </Button>

            <Button className="w-80 bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg" color="success"
                    onPress={handleCalculate}>
                💰 Calculate Split
            </Button>

            {error &&
                <Alert className="mt-2"  color="warning" title={error} />}
            {/* ----- Transaction Result ----- */}
            {transactions.length > 0 && (
                <Card className="mt-2 w-full md:w-9/12" >
                    <CardHeader>💳 Transactions</CardHeader>
                    <Divider/>
                    <CardBody>
                        <ul className="list-disc ml-4">
                            {transactions.map((t, idx) => {
                                const recipient = participants.find((p) => p.name === t.to);

                                return (
                                    <li key={idx} className="flex justify-between items-center">
                                        <div>
                                            <strong>{t.from}</strong> owes&nbsp;
                                            <strong>{t.to}</strong> 💰 ${t.amount.toFixed(2)}
                                        </div>

                                        {recipient?.paymentDetails && (
                                            <Snippet className="ml-2" color="primary" size="sm"
                                                 symbol="PayID : ">{recipient.paymentDetails}</Snippet>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </CardBody>
                </Card>
            )
            }
        </section>
    );
}
