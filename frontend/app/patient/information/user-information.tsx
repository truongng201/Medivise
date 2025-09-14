"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  User,
  Phone,
  Mail,
  MapPin,
  CalendarIcon,
  Edit,
  Save,
  MessageCircle,
  Star,
  Stethoscope,
  GraduationCap,
  Award,
  Clock,
  UserPlus,
  Send,
  Fingerprint,
  Package2,
  Bandage,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UserInformationProps {
  user: any;
  // onUpdateUser: (user: any) => void
}

export default function UserInformation({ user }: UserInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [contactPriority, setContactPriority] = useState("normal");
  const [appointmentDate, setAppointmentDate] = useState<Date>();
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [requestSpecialty, setRequestSpecialty] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requestUrgency, setRequestUrgency] = useState("routine");

  // Mock data for assigned doctors
  const assignedDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "City General Hospital",
      phone: "+1 (555) 123-4567",
      email: "sarah.johnson@hospital.com",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      experience: "15 years",
      education: "Harvard Medical School",
      status: "Available",
      nextAvailable: "Today, 2:00 PM",
      languages: ["English", "Spanish"],
      specializations: [
        "Heart Surgery",
        "Preventive Cardiology",
        "Interventional Cardiology",
      ],
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      hospital: "Metro Health Center",
      phone: "+1 (555) 987-6543",
      email: "michael.chen@metro.com",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      experience: "12 years",
      education: "Johns Hopkins University",
      status: "Busy",
      nextAvailable: "Tomorrow, 10:00 AM",
      languages: ["English", "Mandarin"],
      specializations: [
        "Skin Cancer",
        "Cosmetic Dermatology",
        "Pediatric Dermatology",
      ],
    },
  ];

  const specialties = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleSave = () => {
    // onUpdateUser(editedUser)
    setIsEditing(false);
  };

  const handleContactDoctor = () => {
    // Handle contact logic here
    setShowContactDialog(false);
    setContactMessage("");
    setContactPriority("normal");
  };

  const handleScheduleAppointment = () => {
    // Handle scheduling logic here

    setShowScheduleDialog(false);
    setAppointmentDate(undefined);
    setAppointmentTime("");
    setAppointmentType("consultation");
  };

  const handleRequestNewDoctor = () => {
    // Handle new doctor request logic here
    setShowRequestDialog(false);
    setRequestSpecialty("");
    setRequestReason("");
    setRequestUrgency("routine");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Information</h1>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="doctors">My Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Edit className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.profile_picture_url || "/placeholder.svg"}
                    alt={user?.fullname}
                  />
                  <AvatarFallback className="text-lg">
                    {user?.fullname
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.fullname}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          fullname: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.fullname}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{user?.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedUser.phone_number || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          phone_number: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{user?.phone_number || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedUser.date_of_birth || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          date_of_birth: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>{user?.date_of_birth || "Not provided"}</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.gender || ""}
                      onValueChange={(val) =>
                        setEditedUser({ ...editedUser, gender: val })
                      }
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.gender || "Not provided"}</span>
                    </div>
                  )}
                </div>
                {/* Ethnicity */}
                <div className="space-y-2">
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.ethnicity || ""}
                      onValueChange={(val) =>
                        setEditedUser({ ...editedUser, ethnicity: val })
                      }
                    >
                      <SelectTrigger id="ethnicity">
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hispanic">Hispanic</SelectItem>
                        <SelectItem value="nonhispanic">
                          Non-Hispanic
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.ethnicity || "Not provided"}</span>
                    </div>
                  )}
                </div>
                {/* Race */}
                <div className="space-y-2">
                  <Label htmlFor="race">Race</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.race || ""}
                      onValueChange={(val) =>
                        setEditedUser({ ...editedUser, race: val })
                      }
                    >
                      <SelectTrigger id="race">
                        <SelectValue placeholder="Select race" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.race || "Not provided"}</span>
                    </div>
                  )}
                </div>
                {/* Tobacco Smoking Status */}
                <div className="space-y-2">
                  <Label htmlFor="tobacco">Tobacco Smoking Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.tobacco || ""}
                      onValueChange={(val) =>
                        setEditedUser({ ...editedUser, tobacco: val })
                      }
                    >
                      <SelectTrigger id="tobacco">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never smoker</SelectItem>
                        <SelectItem value="former">Former smoker</SelectItem>
                        <SelectItem value="current">
                          Current every day smoker
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.tobacco || "Not provided"}</span>
                    </div>
                  )}
                </div>
                {/* Pain Severity */}
                <div className="space-y-2">
                  <Label htmlFor="pain">Pain Severity</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.pain || ""}
                      onValueChange={(val) =>
                        setEditedUser({ ...editedUser, pain: val })
                      }
                    >
                      <SelectTrigger id="pain">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.pain || "Not provided"}</span>
                    </div>
                  )}
                </div>
                {/* BMI */}
                <div className="space-y-2">
                  <Label htmlFor="bmi">BMI</Label>
                  {isEditing ? (
                    <Input
                      id="bmi"
                      type="number"
                      value={editedUser.bmi || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, bmi: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{user?.bmi || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Your medical information and history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-500">
                      {user?.allergies?.join(", ") || "No known allergies"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Current Medications</h3>
                  <div className="space-y-2">
                    {Array.isArray(user?.current_medications) &&
                    user?.current_medications.length > 0 ? (
                      user?.current_medications.map(
                        (medication: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                          >
                            <span>{medication.name}</span>
                            <Badge variant="outline">{medication.dosage}</Badge>
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-gray-500">
                        No current medications
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Doctors</h2>
              <p className="text-gray-600">
                Healthcare providers assigned to your care
              </p>
            </div>
            <Dialog
              open={showRequestDialog}
              onOpenChange={setShowRequestDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Request New Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Request New Doctor</DialogTitle>
                  <DialogDescription>
                    Submit a request to be assigned to a new healthcare provider
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Select
                      value={requestSpecialty}
                      onValueChange={setRequestSpecialty}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={requestUrgency}
                      onValueChange={setRequestUrgency}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Request</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe your medical needs..."
                      value={requestReason}
                      onChange={(e) => setRequestReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowRequestDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleRequestNewDoctor}>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {assignedDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={doctor.avatar || "/placeholder.svg"}
                          alt={doctor.name}
                        />
                        <AvatarFallback>
                          {doctor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {doctor.name}
                          </h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{doctor.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{doctor.experience}</span>
                          </div>
                          <Badge
                            variant={
                              doctor.status === "Available"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {doctor.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Stethoscope className="h-4 w-4 text-gray-400" />
                            <span>{doctor.hospital}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>Next available: {doctor.nextAvailable}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={doctor.avatar || "/placeholder.svg"}
                                  alt={doctor.name}
                                />
                                <AvatarFallback>
                                  {doctor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="text-xl font-semibold">
                                  {doctor.name}
                                </h3>
                                <p className="text-gray-600">
                                  {doctor.specialty}
                                </p>
                              </div>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold flex items-center space-x-2">
                                  <Award className="h-4 w-4" />
                                  <span>Education</span>
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {doctor.education}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold flex items-center space-x-2">
                                  <Star className="h-4 w-4" />
                                  <span>Experience</span>
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {doctor.experience}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">Specializations</h4>
                              <div className="flex flex-wrap gap-2">
                                {doctor.specializations.map((spec, index) => (
                                  <Badge key={index} variant="secondary">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">Languages</h4>
                              <div className="flex flex-wrap gap-2">
                                {doctor.languages.map((lang, index) => (
                                  <Badge key={index} variant="outline">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-semibold">
                                Contact Information
                              </h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{doctor.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{doctor.email}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowContactDialog(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowScheduleDialog(true);
                        }}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Doctor Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedDoctor?.name}</DialogTitle>
            <DialogDescription>
              Send a secure message to your healthcare provider
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={contactPriority}
                onValueChange={setContactPriority}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContactDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleContactDoctor}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Book an appointment with {selectedDoctor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !appointmentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {appointmentDate
                      ? format(appointmentDate, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={setAppointmentDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select
                value={appointmentTime}
                onValueChange={setAppointmentTime}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={appointmentType}
                onValueChange={setAppointmentType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="check-up">Check-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleAppointment}>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
