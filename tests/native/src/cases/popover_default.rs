use gtk::prelude::*;
use relm4::prelude::*;

pub struct PopoverDefault;

#[relm4::component(pub)]
impl SimpleComponent for PopoverDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Popover {
            set_child: Some(&gtk::Label::builder().label("Label").build()),
            set_autohide: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
