use gtk::prelude::*;
use relm4::prelude::*;

pub struct BoxHorizontal;

#[relm4::component(pub)]
impl SimpleComponent for BoxHorizontal {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Box {
            set_orientation: gtk::Orientation::Horizontal,
            gtk::Label {
                set_label: "Label",
            }
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
